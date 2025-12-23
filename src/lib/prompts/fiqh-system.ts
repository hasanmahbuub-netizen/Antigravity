/**
 * IMANOS Fiqh System Prompt V3
 * Structured JSON output for collapsible UI sections
 */

export const FIQH_SYSTEM_PROMPT = `
You are an Islamic knowledge expert providing educational explanations.

CRITICAL: You MUST respond with ONLY a valid JSON object. No markdown, no plain text, no asterisks, no explanations outside the JSON.

JSON STRUCTURE (follow exactly):
{
  "directAnswer": "2-3 sentence answer from the user's madhab perspective. Clear and direct.",
  "reasoning": "Detailed explanation of WHY this is the ruling. Include Quranic verses, Hadith, and scholarly reasoning. Be thorough (200-300 words).",
  "otherSchools": [
    {
      "madhab": "Shafi'i",
      "position": "Their view if different from user's madhab"
    },
    {
      "madhab": "Maliki", 
      "position": "Their view if different"
    },
    {
      "madhab": "Hanbali",
      "position": "Their view if different"
    }
  ],
  "citations": [
    {
      "source": "Quran",
      "reference": "Surah Al-Baqarah 2:183",
      "text": "Relevant verse excerpt"
    },
    {
      "source": "Hadith",
      "reference": "Sahih Bukhari 1905",
      "text": "Relevant hadith excerpt"
    },
    {
      "source": "Scholar",
      "reference": "Imam Abu Hanifa in Al-Hidayah",
      "text": "Relevant scholarly opinion"
    }
  ]
}

RULES:
1. directAnswer: Must be 2-3 sentences max, clear, from {MADHAB} perspective
2. reasoning: Detailed explanation with evidence (200-300 words)
3. otherSchools: Only include if they differ significantly. If same, use empty array []
4. citations: Include 2-5 specific sources with exact references
5. NO markdown formatting inside the JSON values
6. NO asterisks, hashtags, or bold markers
7. Response must be valid JSON that can be parsed with JSON.parse()
8. Always end directAnswer with the madhab name for clarity

Remember: Output MUST be valid JSON only. No extra text before or after.
`.trim();

export function buildFiqhPrompt(question: string, madhab: string): string {
  return `
User's madhab: ${madhab}
User's question: "${question}"

Provide a comprehensive answer in the JSON format specified in your instructions.

Key requirements:
1. directAnswer: 2-3 sentences from ${madhab} perspective
2. reasoning: Detailed explanation with evidence (200-300 words)  
3. otherSchools: Only include if views differ significantly
4. citations: 2-5 specific sources with exact references

Respond with ONLY valid JSON. No markdown, no explanations outside JSON.
  `.trim();
}

export interface FiqhStructuredAnswer {
  directAnswer: string;
  reasoning: string;
  otherSchools: Array<{ madhab: string; position: string }>;
  citations: Array<{ source: string; reference: string; text: string }>;
}

/**
 * Parse and validate Fiqh AI response
 */
export function parseFiqhResponse(rawText: string): FiqhStructuredAnswer {
  // Clean up common issues
  let cleanText = rawText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .replace(/^\s*{/, '{')
    .replace(/}\s*$/, '}')
    .trim();

  try {
    const parsed = JSON.parse(cleanText);

    // Validate required fields
    if (!parsed.directAnswer || typeof parsed.directAnswer !== 'string') {
      throw new Error('Missing directAnswer');
    }

    return {
      directAnswer: parsed.directAnswer,
      reasoning: parsed.reasoning || 'Detailed reasoning not available.',
      otherSchools: Array.isArray(parsed.otherSchools) ? parsed.otherSchools : [],
      citations: Array.isArray(parsed.citations) ? parsed.citations : []
    };

  } catch (error) {
    console.error('JSON parse failed, using fallback structure');

    // Return the raw text as direct answer if parsing fails
    return {
      directAnswer: rawText.substring(0, 500),
      reasoning: 'Unable to parse detailed reasoning. Please try again.',
      otherSchools: [],
      citations: []
    };
  }
}

/**
 * Fallback structured answers for common topics
 */
export function getFallbackStructuredAnswer(question: string, madhab: string): FiqhStructuredAnswer {
  const lowerQ = question.toLowerCase();

  if (lowerQ.includes('ameen') || lowerQ.includes('amin')) {
    return {
      directAnswer: `In the ${madhab} school, "Ameen" is said silently after reciting Al-Fatiha in prayer. This applies whether praying alone or behind an Imam, based on the interpretation of Hanafi scholars.`,
      reasoning: `The ${madhab} position is based on the principle that prayer should be conducted with tranquility and minimal audible speech beyond the required recitations. The Prophet Muhammad (peace be upon him) is reported to have said "Ameen" during prayer, but there is scholarly difference on whether this was audible or silent. ${madhab} scholars interpret the evidence to support silent recitation. This view is found in classical ${madhab} texts such as Al-Hidayah and is based on the understanding that additional words in prayer should be minimized to maintain focus and reverence. The reasoning extends from the general principle that only what is explicitly required should be said aloud in prayer.`,
      otherSchools: [
        { madhab: "Shafi'i", position: "In the Shafi'i school, saying 'Ameen' aloud after Al-Fatiha is recommended (mustahabb), especially when praying in congregation behind an Imam." },
        { madhab: "Maliki", position: "The Maliki school holds that 'Ameen' should be said silently by the one praying alone, but when behind an Imam, it may be said aloud by the followers." },
        { madhab: "Hanbali", position: "The Hanbali school permits saying 'Ameen' aloud in all prayers based on certain Hadith narrations." }
      ],
      citations: [
        { source: "Hadith", reference: "Sahih Bukhari 780", text: "The Prophet said 'Ameen' when the Imam finished reciting Al-Fatiha." },
        { source: "Hadith", reference: "Sunan Abu Dawud 932", text: "When the Imam says 'Ameen', you should also say 'Ameen'." },
        { source: "Scholar", reference: "Al-Hidayah by Al-Marghinani", text: "The ruling in our school is that 'Ameen' is said silently in prayer." }
      ]
    };
  }

  if (lowerQ.includes('wudu') || lowerQ.includes('ablution')) {
    return {
      directAnswer: `According to ${madhab} jurisprudence, wudu consists of washing specific body parts in order: face, arms to elbows, wiping head, and washing feet to ankles. These are the obligatory (fard) acts.`,
      reasoning: `Wudu is a prerequisite for prayer based on the Quranic verse in Surah Al-Ma'idah. The obligatory acts are derived directly from this verse: "O you who believe, when you rise for prayer, wash your faces and your hands up to the elbows, wipe over your heads, and wash your feet up to the ankles." The ${madhab} school requires these acts to be performed in this sequence, and each part must be washed at least once. Additional sunnah acts include saying Bismillah, using miswak, and washing each part three times to follow the Prophet's practice.`,
      otherSchools: [],
      citations: [
        { source: "Quran", reference: "Surah Al-Ma'idah 5:6", text: "O you who believe, when you rise for prayer, wash your faces and your hands up to the elbows..." },
        { source: "Hadith", reference: "Sahih Muslim 224", text: "Allah does not accept the prayer without purification." }
      ]
    };
  }

  // Generic fallback
  return {
    directAnswer: `Based on ${madhab} scholarship, this question relates to important aspects of Islamic jurisprudence that require careful consideration of Quran, Hadith, and scholarly consensus.`,
    reasoning: `The ${madhab} school approaches this topic by examining the relevant Quranic verses, authentic Hadith narrations, and the opinions of classical scholars. In matters where there is no explicit text, ${madhab} scholars apply analogical reasoning (qiyas) and consider scholarly consensus (ijma'). For detailed guidance on specific situations, consulting with a qualified scholar who can assess your particular circumstances is recommended.`,
    otherSchools: [],
    citations: [
      { source: "Quran", reference: "Surah An-Nahl 16:43", text: "Ask the people of knowledge if you do not know." }
    ]
  };
}
