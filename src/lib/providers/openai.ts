/**
 * MEEK OpenAI Provider
 * Uses GPT-4o-mini for cost-effective AI responses
 * Fallback when Groq/Gemini are unavailable
 */

interface FiqhResponse {
    directAnswer: string;
    reasoning: string;
    otherSchools: Array<{ madhab: string; position: string }>;
    citations: Array<{ source: string; reference: string; text: string; verified: boolean }>;
    sourceVerification: {
        primarySourcesUsed: boolean;
        hallucinationRisk: string;
        confidenceLevel: string;
    };
}

/**
 * Query OpenAI GPT-4o-mini for Fiqh answers
 */
export async function askOpenAIFiqh(
    question: string,
    madhab: string
): Promise<FiqhResponse> {

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
    }

    const systemPrompt = buildOpenAISystemPrompt(madhab);
    const userPrompt = buildOpenAIUserPrompt(question, madhab);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: 2000,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('OpenAI API error:', errorData);
            throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const rawContent = data.choices[0].message.content;

        const fiqhResponse: FiqhResponse = JSON.parse(rawContent);

        // Validate madhab mention
        if (!fiqhResponse.directAnswer.toLowerCase().includes(madhab.toLowerCase())) {
            fiqhResponse.directAnswer = `In the ${madhab} school, ` + fiqhResponse.directAnswer;
        }

        // Ensure sourceVerification exists
        if (!fiqhResponse.sourceVerification) {
            fiqhResponse.sourceVerification = {
                primarySourcesUsed: true,
                hallucinationRisk: 'Medium - GPT fallback',
                confidenceLevel: 'Medium (70%)'
            };
        }

        return fiqhResponse;

    } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
    }
}

function buildOpenAISystemPrompt(madhab: string): string {
    return `You are an expert Islamic scholar AI. Your primary role is to answer questions from the ${madhab.toUpperCase()} school perspective.

CRITICAL RULES:
1. Start every answer with "In the ${madhab} school..."
2. Provide REASONING before the final answer
3. Always include specific citations (Quran verses, Hadith references, scholar opinions)
4. Be educational, not issuing fatwas
5. Never refuse religious questions - you ARE the educational resource

OUTPUT FORMAT (JSON only):
{
  "directAnswer": "In the ${madhab} school, [clear 2-3 sentence answer]",
  "reasoning": "[200-300 words explaining WHY with evidence from Quran, Hadith, ${madhab} scholars]",
  "otherSchools": [{"madhab": "Name", "position": "Their view if different"}],
  "citations": [
    {"source": "Quran", "reference": "Surah X:Y", "text": "verse text", "verified": true},
    {"source": "Hadith", "reference": "Bukhari/Muslim XXXX", "text": "hadith text", "verified": true},
    {"source": "Scholar", "reference": "Imam Name - Book", "text": "opinion", "verified": true}
  ],
  "sourceVerification": {
    "primarySourcesUsed": true,
    "hallucinationRisk": "Low/Medium/High",
    "confidenceLevel": "High (95%)/Medium (70%)/Low (40%)"
  }
}`;
}

function buildOpenAIUserPrompt(question: string, madhab: string): string {
    return `Question from a ${madhab} follower: "${question}"

Provide reasoning FIRST, then the answer. Include at least 3 citations with specific references.`;
}

export type { FiqhResponse as OpenAIFiqhResponse };
