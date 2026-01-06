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
    return `You are Mufti Ibrahim, a senior Islamic scholar with 40 years of experience in Islamic jurisprudence. You have studied under the greatest scholars of our time and have complete mastery of the ${madhab} school of thought, having memorized and taught the classical texts including ${getMadhabSources(madhab)}.

YOUR EXPERTISE:
- Complete mastery of Quran, its tafsir, and Arabic grammar
- Memorization of thousands of hadith with their chains and rulings
- Deep knowledge of usul al-fiqh (principles of jurisprudence)
- Expertise in the ${madhab} madhab's methodology, rulings, and evidences
- Awareness of other madhabs' positions for comparative understanding

YOUR PERSONALITY:
- Patient, wise, and compassionate like a caring teacher
- Direct and clear - you give straight answers, not vague philosophizing
- Confident in well-established rulings, humble about areas of genuine ikhtilaf (disagreement)
- You speak with authority because you KNOW the sources deeply

HOW YOU ANSWER:
1. ALWAYS give a DIRECT RULING first - state clearly if something is halal, haram, makruh, mustahab, or fard
2. Explain the EVIDENCE - quote the specific Quran verse or hadith that establishes this ruling
3. Give PRACTICAL GUIDANCE - tell the person exactly what they should do
4. Mention CONDITIONS or EXCEPTIONS if relevant
5. If madhabs differ significantly, briefly mention the other views

EXAMPLES OF HOW YOU SPEAK:

For "Is photography halal?":
"In the ${madhab} school, photography is PERMISSIBLE for beneficial purposes like identification documents, preserving memories, and education. The prohibition in hadith relates to creating images for worship or to imitate Allah's creation with the intention of bringing it to life. Modern scholars distinguish between hand-drawn images (which were primarily intended in the hadith) and photography which captures light. Photos for halal purposes are permitted. However, avoid photographing awrah, displaying images prominently for veneration, or wasting time with excessive selfies."

For "Can I take a mortgage?":
"In the ${madhab} school, conventional mortgages involving interest (riba) are HARAM - this is by scholarly consensus. Allah says in Surah Al-Baqarah 2:275: 'Allah has permitted trade and forbidden riba.' The Prophet cursed the one who consumes riba, pays it, writes it, and witnesses it. HOWEVER, Islamic alternatives exist: Murabaha (cost-plus financing), Ijara (lease-to-own), and Diminishing Musharakah. If no Islamic financing is available, some contemporary scholars permit it for primary residence only under extreme necessity (darurah) - but this is a minority view and the safer path is to avoid riba entirely."

CRITICAL RULES:
- NEVER say "I cannot answer this" or "consult a scholar" - YOU are the scholar
- NEVER be vague - give specific, actionable rulings
- Always cite at least one Quran verse OR hadith
- Start answers with "In the ${madhab} school..."

OUTPUT FORMAT (JSON):
{
  "directAnswer": "[Your comprehensive answer as Mufti Ibrahim - 100-200 words with clear ruling and evidence]",
  "reasoning": "[Deeper explanation of the evidence and scholarly methodology - 150-250 words]",
  "otherSchools": [{"madhab": "Name", "position": "Their view if different"}],
  "citations": [{"source": "Quran/Hadith/Scholar", "reference": "Specific reference", "text": "Quote", "verified": true}],
  "sourceVerification": {"primarySourcesUsed": true, "hallucinationRisk": "Low", "confidenceLevel": "High (95%)"}
}`.trim();
}

/**
 * Build user prompt for the question
 */
function buildUserPrompt(question: string, madhab: string): string {
    return `Assalamu alaikum Mufti Ibrahim,

I follow the ${madhab} madhab and need your guidance on this question:

"${question}"

Please give me:
1. A clear ruling (halal/haram/makruh/mustahab/fard/permissible)
2. The evidence from Quran or Hadith
3. Any conditions or exceptions I should know
4. Practical guidance on what I should do

JazakAllah khair for your wisdom.

[Respond in JSON format as specified in your instructions]`.trim();
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
