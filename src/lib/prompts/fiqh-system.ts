/**
 * MEEK Fiqh System Prompt V4
 * Explicit madhab enforcement + No AI refusals
 */

export function getFiqhSystemPrompt(madhab: string): string {
  return `
You are an Islamic knowledge expert providing educational answers.

USER'S MADHAB: ${madhab.toUpperCase()}
CRITICAL: The user follows the ${madhab} school. Your primary answer MUST reflect the ${madhab} position.

RESPONSE FORMAT (JSON only):
{
  "directAnswer": "2-3 sentence answer from ${madhab} perspective. MUST start with: 'In the ${madhab} school...'",
  "reasoning": "Detailed explanation (150-200 words) of WHY the ${madhab} school holds this view. Include evidence from Quran, Hadith, and ${madhab} scholars.",
  "otherSchools": [
    {"madhab": "Shafi'i", "position": "Their view if different"},
    {"madhab": "Maliki", "position": "Their view if different"},
    {"madhab": "Hanbali", "position": "Their view if different"}
  ],
  "citations": [
    {"source": "Quran", "reference": "Surah X:Y", "text": "Relevant excerpt"},
    {"source": "Hadith", "reference": "Sahih Bukhari XXXX", "text": "Hadith text"},
    {"source": "Scholar", "reference": "${madhab} scholar name", "text": "Opinion"}
  ]
}

MANDATORY RULES:
1. directAnswer MUST start with "In the ${madhab} school..." to confirm correct madhab
2. reasoning MUST explain ${madhab} methodology and scholars
3. otherSchools: Only include madhabs that differ. Remove ${madhab} from this array.
4. citations: Include at least one ${madhab} scholar reference
5. NO refusals - you are an educator teaching what scholars have said
6. Religious questions about prayer, dua, fasting are ALLOWED and ENCOURAGED
7. Output must be valid JSON only - no markdown, no extra text

ALLOWED TOPICS (answer ALL of these):
✓ Prayer rulings (salah, wudu, ghusl)
✓ Duas and supplications
✓ Fasting questions (Ramadan, voluntary fasts)
✓ Zakat calculations
✓ Halal/Haram matters
✓ Daily worship practices
✓ Religious obligations
✓ Taharah (purification)
✓ Scholarly differences between madhabs
✓ Saying Ameen in prayer
✓ Prayer times and rulings

Remember: You are teaching what scholars have said, not issuing personal fatwas. This is educational content based on classical Islamic scholarship.
  `.trim();
}

export function buildFiqhPrompt(question: string, madhab: string): string {
  return `
The user follows the ${madhab.toUpperCase()} school and asks:

"${question}"

Provide a comprehensive educational answer in JSON format.

CRITICAL REQUIREMENTS:
1. Start directAnswer with: "In the ${madhab} school..."
2. Base reasoning on ${madhab} scholars and methodology
3. Include ${madhab}-specific citations
4. Only show other madhabs if they differ significantly
5. This is an educational question - provide a helpful answer

Output valid JSON only. No markdown, no extra text.
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
export function parseFiqhResponse(rawText: string, madhab: string): FiqhStructuredAnswer {
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

    // Validate madhab is mentioned
    if (!parsed.directAnswer.toLowerCase().includes(madhab.toLowerCase())) {
      console.warn(`⚠️ Answer does not mention ${madhab}! Fixing...`);
      parsed.directAnswer = `In the ${madhab} school, ` + parsed.directAnswer;
    }

    // Filter out user's madhab from otherSchools
    const filteredSchools = Array.isArray(parsed.otherSchools)
      ? parsed.otherSchools.filter((s: any) =>
        s.madhab?.toLowerCase() !== madhab.toLowerCase()
      )
      : [];

    return {
      directAnswer: parsed.directAnswer,
      reasoning: parsed.reasoning || 'Detailed reasoning not available.',
      otherSchools: filteredSchools,
      citations: Array.isArray(parsed.citations) ? parsed.citations : []
    };

  } catch (error) {
    console.error('JSON parse failed, using fallback structure');

    // Return the raw text as direct answer if parsing fails
    return {
      directAnswer: `In the ${madhab} school, ` + rawText.substring(0, 400),
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

  // Ameen question - madhab specific
  if (lowerQ.includes('ameen') || lowerQ.includes('amin')) {
    if (madhab.toLowerCase() === 'hanafi') {
      return {
        directAnswer: `In the Hanafi school, "Ameen" is said silently (sirran) after reciting Al-Fatiha in prayer. This applies whether praying alone or in congregation, and is based on the interpretation of Imam Abu Hanifa and Hanafi scholars.`,
        reasoning: `The Hanafi position is based on the hadith narrated by Abu Hurairah that the Prophet (peace be upon him) lowered his voice when saying Ameen. Hanafi scholars interpret this as evidence for saying Ameen quietly. Al-Marghinani in Al-Hidayah states: "And he says Ameen after completing Al-Fatiha, and he lowers his voice with it." This is also supported by the principle that additional utterances in prayer should be minimized to maintain focus. The Hanafi methodology prioritizes the narrations that emphasize silent recitation.`,
        otherSchools: [
          { madhab: "Shafi'i", position: "In the Shafi'i school, saying 'Ameen' aloud is recommended (mustahabb) in loud prayers, especially for the follower behind the Imam." },
          { madhab: "Hanbali", position: "The Hanbali school permits saying 'Ameen' aloud in prayers where recitation is loud, based on authentic hadith." }
        ],
        citations: [
          { source: "Hadith", reference: "Sunan Abu Dawud 932", text: "When the Imam says 'Ameen', say 'Ameen' as well." },
          { source: "Scholar", reference: "Al-Hidayah by Al-Marghinani", text: "He says Ameen after Al-Fatiha, lowering his voice." },
          { source: "Scholar", reference: "Radd al-Muhtar by Ibn Abidin", text: "The relied-upon position in our school is silent Ameen." }
        ]
      };
    } else {
      return {
        directAnswer: `In the ${madhab} school, saying "Ameen" aloud after Al-Fatiha is recommended (mustahabb) in prayers where the recitation is loud, such as Fajr, Maghrib, and Isha. This is based on authentic hadith narrations.`,
        reasoning: `The ${madhab} position is based on the hadith of Abu Hurairah in Sahih Bukhari where the Prophet (peace be upon him) said: "When the Imam says 'Ameen', say 'Ameen' as well, for whoever's Ameen coincides with the Ameen of the angels, his previous sins are forgiven." ${madhab} scholars interpret this as evidence for audible Ameen. The wisdom behind this is creating unity in congregation and responding to the recitation together.`,
        otherSchools: [
          { madhab: "Hanafi", position: "In the Hanafi school, 'Ameen' is said silently in all prayers, based on their interpretation of the narrations." }
        ],
        citations: [
          { source: "Hadith", reference: "Sahih Bukhari 780", text: "When the Imam says 'Ghayril maghdhubi alayhim wa lad-dhallin', say 'Ameen'." },
          { source: "Hadith", reference: "Sahih Muslim 410", text: "The Prophet would say Ameen when completing Al-Fatiha." }
        ]
      };
    }
  }

  // Dua questions - always answer
  if (lowerQ.includes('dua') || lowerQ.includes('supplication') || lowerQ.includes('pray')) {
    return {
      directAnswer: `In the ${madhab} school, making dua (supplication) is highly encouraged and considered one of the greatest acts of worship. The Prophet (peace be upon him) said: "Dua is the essence of worship."`,
      reasoning: `According to ${madhab} scholars, dua can be made at any time, though certain times are more blessed: after obligatory prayers, in the last third of the night, between the adhan and iqamah, and on Friday. The etiquette includes facing the qiblah, praising Allah first, sending blessings on the Prophet, and being sincere in asking. ${madhab} scholars emphasize that one should have certainty that Allah hears and responds to duas.`,
      otherSchools: [],
      citations: [
        { source: "Quran", reference: "Surah Ghafir 40:60", text: "Call upon Me; I will respond to you." },
        { source: "Hadith", reference: "Sunan Tirmidhi 3371", text: "Dua is worship (ibadah)." }
      ]
    };
  }

  // Wudu questions
  if (lowerQ.includes('wudu') || lowerQ.includes('ablution')) {
    return {
      directAnswer: `In the ${madhab} school, wudu (ablution) has obligatory acts (fard) that must be performed: washing the face, washing both arms to the elbows, wiping the head, and washing both feet to the ankles.`,
      reasoning: `The obligatory acts of wudu are derived directly from Surah Al-Ma'idah (5:6). ${madhab} scholars have detailed the conditions, integrals, and nullifiers of wudu based on this verse and supporting hadith. The sunnah acts include saying Bismillah, using miswak, washing each limb three times, and making dua after completion. Maintaining wudu is highly meritorious as the Prophet said it is "half of faith."`,
      otherSchools: [],
      citations: [
        { source: "Quran", reference: "Surah Al-Ma'idah 5:6", text: "O you who believe, when you rise for prayer, wash your faces and your hands to the elbows..." },
        { source: "Hadith", reference: "Sahih Muslim 224", text: "Prayer is not accepted without purification." }
      ]
    };
  }

  // Generic fallback
  return {
    directAnswer: `In the ${madhab} school, this matter is addressed based on the Quran, authentic Hadith, and the scholarly tradition of ${madhab} jurists.`,
    reasoning: `The ${madhab} school approaches fiqh questions by examining relevant Quranic verses, authentic hadith narrations, and the opinions of classical scholars. When there is no explicit text, ${madhab} scholars apply their established methodology for deriving rulings. This includes consideration of scholarly consensus (ijma') and analogical reasoning (qiyas) where applicable.`,
    otherSchools: [],
    citations: [
      { source: "Quran", reference: "Surah An-Nahl 16:43", text: "Ask the people of knowledge if you do not know." }
    ]
  };
}
