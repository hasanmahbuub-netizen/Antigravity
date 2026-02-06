/**
 * MEEK Fiqh Engine - Groq Provider
 * Uses Llama 3.3 70B for fast, madhab-aware Islamic Q&A
 */

interface Citation {
    source: string;
    reference: string;
    text: string;
    verified: boolean;
}

interface FiqhResponse {
    directAnswer: string;
    reasoning: string;
    otherSchools: Array<{ madhab: string; position: string }>;
    citations: Citation[];
    sourceVerification: {
        primarySourcesUsed: boolean;
        hallucinationRisk: string;
        confidenceLevel: string;
    };
}

/**
 * Main function to query Groq for Fiqh answers
 */
/**
 * Main function to query Groq for Fiqh answers
 * Includes robust retry logic and error handling
 */
export async function askGroqFiqh(
    question: string,
    madhab: string
): Promise<FiqhResponse> {

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY not configured');
    }

    const systemPrompt = buildSystemPrompt(madhab);
    const userPrompt = buildUserPrompt(question, madhab);

    console.log('🔄 Groq: Sending request...');

    // Retry configuration
    const MAX_RETRIES = 3;
    const INITIAL_BACKOFF = 1000; // 1 second

    let lastError: any;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        try {
            if (attempt > 1) {
                console.log(`🔄 Groq: Retry attempt ${attempt}/${MAX_RETRIES}...`);
            }

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature: 0.3,
                    max_tokens: 800,
                    response_format: { type: 'json_object' }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                // Don't retry on 400 client errors (bad request)
                if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    throw new Error(`Groq API Client Error: ${response.status} - ${errorText}`);
                }
                throw new Error(`Groq API Server Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const rawContent = data.choices?.[0]?.message?.content;

            if (!rawContent) {
                throw new Error('No content in Groq response');
            }

            console.log('📥 Groq raw response:', rawContent.substring(0, 200) + '...');

            let fiqhResponse: FiqhResponse;
            try {
                fiqhResponse = JSON.parse(rawContent);
            } catch (parseError) {
                console.error('❌ Groq: JSON parse failed, trying to extract...');
                const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    fiqhResponse = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error('Could not parse Groq response as JSON');
                }
            }

            // Post-processing
            if (!fiqhResponse.directAnswer?.toLowerCase().includes(madhab.toLowerCase())) {
                fiqhResponse.directAnswer = `In the ${madhab} school, ` + fiqhResponse.directAnswer;
            }

            fiqhResponse.reasoning = fiqhResponse.reasoning || 'See direct answer for details.';
            fiqhResponse.otherSchools = fiqhResponse.otherSchools || [];
            fiqhResponse.citations = fiqhResponse.citations || [];
            fiqhResponse.sourceVerification = fiqhResponse.sourceVerification || {
                primarySourcesUsed: true,
                hallucinationRisk: 'Unknown',
                confidenceLevel: 'Medium (70%)'
            };

            console.log('✅ Groq: Response parsed successfully');
            return fiqhResponse;

        } catch (error: any) {
            clearTimeout(timeoutId);
            lastError = error;
            console.warn(`⚠️ Groq attempt ${attempt} failed:`, error.message);

            // Calculate backoff with jitter
            const backoff = INITIAL_BACKOFF * Math.pow(2, attempt - 1) + Math.random() * 500;

            if (attempt < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, backoff));
            }
        }
    }

    console.error('❌ Groq: All retries failed');
    throw lastError;
}

/**
 * MEEK FIQH ENGINE - Production-Ready System Prompt
 * Fixes vague answers, ensures precise Islamic guidance
 */
function buildSystemPrompt(madhab: string): string {
    return `You are Meek's Islamic Fiqh Engine. Your role is to provide precise, sourced Islamic guidance based on Quranic principles, Hadith, and madhab-specific jurisprudence.

CRITICAL RULES:
1. PRECISION OVER PHILOSOPHY: Answer the specific question. No vague generalizations.
2. MADHAB-AWARE: Always explain the user's madhab (${madhab}) position first, then mention alternatives.
3. SOURCE CITATIONS: Reference Quran, Hadith, or madhab scholars. Be specific (e.g., "Quran 2:183" or "Sahih Bukhari 1234").
4. PRACTICAL ACTIONS: End with 2-3 concrete steps the user can take immediately.
5. NEVER FATWA: Say "Islamic scholars view this as..." not "You must...". Offer multiple views when they exist.
6. AVOID JARGON: Explain Islamic terms simply. Example: "Wudu (ritual cleansing) involves..."
7. STRUCTURE STRICTLY: Follow the JSON format below. No deviations.

EXAMPLES OF GOOD ANSWERS:
Q: "Can I pray on an airplane?"
✅ GOOD: "Yes. In the ${madhab} school, if you cannot face Mecca or stand, you can pray sitting and indicate direction with your head. This is based on Quran 4:101."
❌ BAD: "Islam teaches us to always maintain our connection with Allah regardless of circumstances."

Q: "Is dropshipping halal?"
✅ GOOD: "Dropshipping is halal in the ${madhab} school if three conditions are met: (1) You own or have binding agreement for the goods. (2) You deliver exactly what was promised. (3) No deception about source or quality."
❌ BAD: "Islam encourages honest trade. Many factors must be considered."

OUTPUT FORMAT (You MUST return valid JSON):
{
  "directAnswer": "Direct, concise answer (2-3 sentences max) starting with 'In the ${madhab} school...'",
  "reasoning": "In the ${madhab} school: [specific position with evidence]. Brief explanation.",
  "otherSchools": [{"madhab": "Other school name", "position": "Their specific position"}],
  "citations": [{"source": "Quran/Hadith/Scholar", "reference": "Specific reference like Quran 2:183", "text": "Relevant quote", "verified": true}],
  "sourceVerification": {"primarySourcesUsed": true, "hallucinationRisk": "Low", "confidenceLevel": "High (90%)"}
}

DISCLAIMER TO INCLUDE: This is Islamic guidance, not a binding ruling. Consult a qualified scholar for personal situations.`.trim();
}

/**
 * Build user prompt with context
 */
function buildUserPrompt(question: string, madhab: string): string {
    return `Question: ${question}

User's Madhab: ${madhab}

Respond ONLY in JSON format. Be precise and practical. No vague philosophy.`.trim();
}


/**
 * Get madhab-specific primary sources
 */
function getMadhabSources(madhab: string): string {
    const sources: Record<string, string> = {
        'Hanafi': 'PRIMARY SOURCES FOR HANAFI:\nAl-Hidayah (Al-Marghinani), Al-Mabsut (Al-Sarakhshi), Fatawa Alamgiri, Al-Ashbah wa an-Nazair (Ibn Nujaym), Radd al-Muhtar (Ibn Abidin)',
        'Shafi\'i': 'PRIMARY SOURCES FOR SHAFI\'I:\nAl-Umm (Imam al-Shafi\'i), Al-Majmu\' (An-Nawawi), Minhaj al-Talibin (An-Nawawi), Fath al-Wahhab (Zakariyya al-Ansari)',
        'Maliki': 'PRIMARY SOURCES FOR MALIKI:\nAl-Muwatta\' (Malik ibn Anas), Al-Mudawwana (Sahnun), Risalah (Ibn Abi Zayd al-Qayrawani), Khalil (Khalil ibn Ishaq)',
        'Hanbali': 'PRIMARY SOURCES FOR HANBALI:\nMusnad Ahmad, Al-Mughni (Ibn Qudamah), Al-Muqni\' (Ibn Qudamah), Kashaf al-Qina\' (Al-Bahuti)'
    };
    return sources[madhab] || 'Classical fiqh texts';
}

/**
 * Get madhab-specific scholars
 */
function getMadhabScholars(madhab: string): string {
    const scholars: Record<string, string> = {
        'Hanafi': 'KEY HANAFI SCHOLARS:\nImam Abu Hanifa (d. 150 AH), Abu Yusuf (d. 182 AH), Muhammad al-Shaybani (d. 189 AH), Al-Sarakhshi (d. 483 AH), Ibn Abidin (d. 1252 AH)',
        'Shafi\'i': 'KEY SHAFI\'I SCHOLARS:\nImam al-Shafi\'i (d. 204 AH), An-Nawawi (d. 676 AH), Ibn Hajar al-Asqalani (d. 852 AH), Ar-Ramli (d. 1004 AH)',
        'Maliki': 'KEY MALIKI SCHOLARS:\nImam Malik ibn Anas (d. 179 AH), Ibn al-Qasim (d. 191 AH), Sahnun (d. 240 AH), Ibn Abi Zayd al-Qayrawani (d. 386 AH)',
        'Hanbali': 'KEY HANBALI SCHOLARS:\nImam Ahmad ibn Hanbal (d. 241 AH), Ibn Qudamah (d. 620 AH), Ibn Taymiyyah (d. 728 AH), Ibn al-Qayyim (d. 751 AH)'
    };
    return scholars[madhab] || 'Classical Islamic scholars';
}

/**
 * Get madhab-specific methodology
 */
function getMadhabMethodology(madhab: string): string {
    const methods: Record<string, string> = {
        'Hanafi': 'HANAFI METHODOLOGY:\nEmphasizes logical reasoning (Ra\'y), analogical deduction (Qiyas), and juristic preference (Istihsan). Strong reliance on established principles.',
        'Shafi\'i': 'SHAFI\'I METHODOLOGY:\nStrict adherence to authenticated Hadith with systematic legal theory. Clear hierarchy: Quran > Sunnah > Ijma\' > Qiyas.',
        'Maliki': 'MALIKI METHODOLOGY:\nPractices of Medina (Amal Ahl al-Madinah) as key source. Masalih Mursalah (public interests) as legal principle.',
        'Hanbali': 'HANBALI METHODOLOGY:\nStrong preference for Hadith over analogical reasoning. Follows explicit textual evidence closely.'
    };
    return methods[madhab] || 'Classical usul al-fiqh principles';
}

/**
 * Validate citations for proper formatting
 */
function validateCitations(citations: Citation[], madhab: string): void {
    if (!Array.isArray(citations)) return;

    const validCollections = [
        'Sahih Bukhari', 'Sahih Muslim', 'Abu Dawud', 'Tirmidhi',
        'Nasa\'i', 'Ibn Majah', 'Muwatta', 'Musnad Ahmad'
    ];

    citations.forEach((citation, index) => {
        if (!citation.source || !citation.reference || !citation.text) {
            console.warn(`Citation ${index + 1} missing required fields`);
        }

        if (citation.source === 'Hadith') {
            const isValid = validCollections.some(c =>
                citation.reference.toLowerCase().includes(c.toLowerCase())
            );
            if (!isValid) {
                console.warn(`Hadith reference may not be verifiable: ${citation.reference}`);
            }
        }
    });
}

export type { FiqhResponse, Citation };
