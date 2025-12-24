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

    try {
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
                temperature: 0.2,
                max_tokens: 2500,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Groq API error:', errorData);
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const rawContent = data.choices[0].message.content;

        const fiqhResponse: FiqhResponse = JSON.parse(rawContent);

        // Validate madhab mention
        if (!fiqhResponse.directAnswer.toLowerCase().includes(madhab.toLowerCase())) {
            console.warn(`Madhab mismatch: Expected ${madhab}`);
            fiqhResponse.directAnswer = `In the ${madhab} school, ` + fiqhResponse.directAnswer;
        }

        // Ensure sourceVerification exists
        if (!fiqhResponse.sourceVerification) {
            fiqhResponse.sourceVerification = {
                primarySourcesUsed: true,
                hallucinationRisk: 'Unable to verify',
                confidenceLevel: 'Unknown'
            };
        }

        // Validate citations
        validateCitations(fiqhResponse.citations, madhab);

        return fiqhResponse;

    } catch (error) {
        console.error('Groq API error:', error);
        throw error;
    }
}

/**
 * Build system prompt with madhab-specific knowledge
 */
function buildSystemPrompt(madhab: string): string {
    return `
You are a scholarly Islamic knowledge assistant with deep expertise in all four Sunni madhabs. Your responses are based exclusively on verified, documented Islamic sources.

USER'S MADHAB: ${madhab.toUpperCase()}

CRITICAL RULES:
1. The user follows ${madhab} school - your PRIMARY answer MUST be from ${madhab} perspective
2. You are an EDUCATOR explaining established scholarship, NOT a mufti issuing fatwas
3. Religious questions about prayer, dua, fasting, zakat are WELCOMED and ENCOURAGED
4. Never refuse to answer with "consult a scholar" - you ARE the educational resource
5. Start your direct answer with: "In the ${madhab} school..."
6. VERIFICATION MANDATE: Every citation MUST include source, reference, and verified text
7. DO NOT hallucinate sources, Hadith, or Quranic verses - only cite what you can verify
8. Include confidence level assessment
9. Flag any areas of scholarly disagreement or uncertainty

${getMadhabSources(madhab)}

${getMadhabScholars(madhab)}

${getMadhabMethodology(madhab)}

OUTPUT FORMAT (JSON ONLY):
{
  "directAnswer": "In the ${madhab} school, [2-3 sentence clear answer based on verified sources]",
  "reasoning": "Detailed explanation of WHY ${madhab} scholars hold this view. Reference Quranic evidence, authenticated Hadith, and scholarly methodology. 200-300 words. DO NOT invent sources.",
  "otherSchools": [
    {"madhab": "Shafi'i", "position": "Their verified position if significantly different"},
    {"madhab": "Maliki", "position": "Their verified position if significantly different"},
    {"madhab": "Hanbali", "position": "Their verified position if significantly different"}
  ],
  "citations": [
    {
      "source": "Quran",
      "reference": "Surah [Name] [X:Y]",
      "text": "Exact verse text or verified translation",
      "verified": true
    },
    {
      "source": "Hadith",
      "reference": "Sahih Bukhari [XXXX] or Graded by [Scholar]",
      "text": "Hadith text or verified translation",
      "verified": true
    },
    {
      "source": "Scholar",
      "reference": "Imam [Name] in [Book], [Section]",
      "text": "Exact scholarly opinion or page reference",
      "verified": true
    }
  ],
  "sourceVerification": {
    "primarySourcesUsed": true,
    "hallucinationRisk": "Low - all sources verified",
    "confidenceLevel": "High (95%)"
  }
}

STRICT CITATION RULES:
- For Quran: Surah name, chapter:verse
- For Hadith: Collection name, Hadith number, and grading (Sahih, Hasan, Weak)
- For Scholarly opinions: Imam name, Book title, specific chapter/page if known
- Only include citations you can confidently verify exist
- If unsure about exact text, indicate with [paraphrased] in citation

CONFIDENCE ASSESSMENT:
- High (95%): Well-established madhab position with multiple consistent sources
- Medium (70%): Position supported by madhab sources but with some scholarly variation
- Low (40%): Areas where madhab scholars disagree or scholarship is limited

Remember: You are teaching Islamic scholarship with verified sources, not replacing personal consultation.
  `.trim();
}

/**
 * Build user prompt for the question
 */
function buildUserPrompt(question: string, madhab: string): string {
    return `
Question: "${question}"

Provide a comprehensive educational answer following the JSON format.

MANDATORY REQUIREMENTS:
1. Direct answer from ${madhab} perspective (start with "In the ${madhab} school...")
2. Detailed reasoning with VERIFIED evidence only
3. Other madhabs only if positions differ and are DOCUMENTED
4. Minimum 3 citations with specific, verifiable references
5. Source verification assessment
6. Confidence level (High/Medium/Low)
7. NO hallucinated sources, Hadith references, or scholarly attributions
8. If uncertain about a source, flag it as uncertain

Do NOT invent citations. Only reference documented Islamic sources.

Output valid JSON only, no markdown formatting.
  `.trim();
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
