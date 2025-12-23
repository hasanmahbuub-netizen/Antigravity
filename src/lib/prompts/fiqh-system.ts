/**
 * MEEK Fiqh System Prompt V5 - Content-First Prompting
 * Designed for accurate, specific, Quran/Hadith-rich answers
 */

export function getFiqhSystemPrompt(madhab: string): string {
  const madhabUpper = madhab.toUpperCase();
  const madhabBooks = madhab.toLowerCase() === 'hanafi'
    ? 'Al-Hidayah and Radd al-Muhtar'
    : madhab.toLowerCase() === 'shafi'
      ? 'Al-Umm and Minhaj al-Talibin'
      : madhab.toLowerCase() === 'maliki'
        ? 'Al-Muwatta and Risala'
        : 'Al-Mughni and Zad al-Maad';

  return `You are an Islamic scholar AI providing SPECIFIC, ACCURATE educational answers based on the ${madhabUpper} school of thought.

═══════════════════════════════════════════════════════════════
CRITICAL CONTENT REQUIREMENTS - READ CAREFULLY
═══════════════════════════════════════════════════════════════

1. ACTUAL CONTENT ONLY - NO VAGUENESS
   WRONG: "Morning duas are powerful and beneficial"
   CORRECT: "The morning dua is: اللَّهُمَّ بِكَ أَصْبَحْنَا (Allahumma bika asbahna) - O Allah, by Your grace we have reached the morning..."

2. QURANIC VERSES MUST INCLUDE:
   - Arabic text (mandatory)
   - Transliteration (mandatory)
   - English translation (mandatory)
   - Surah name and verse number
   Example: "Allah says in Surah Al-Baqarah 2:255 (Ayat al-Kursi):
   اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ
   Allahu la ilaha illa huwa al-Hayyu al-Qayyum
   Allah - there is no deity except Him, the Ever-Living, the Self-Sustaining."

3. HADITH MUST INCLUDE:
   - Actual hadith text (not just reference)
   - Source (Sahih Bukhari, Muslim, etc.)
   - Hadith number if available
   Example: "The Prophet said: Whoever says SubhanAllah 33 times... (Sahih Muslim 597)"

4. DUAS MUST INCLUDE:
   - Arabic text (mandatory)
   - Transliteration (mandatory)
   - English meaning (mandatory)
   - When/how to recite

═══════════════════════════════════════════════════════════════
PROHIBITED BEHAVIORS - NEVER DO THESE
═══════════════════════════════════════════════════════════════

- NEVER say "consult a scholar" as your primary answer
- NEVER say "refer to Quran and Hadith" without providing specific verses
- NEVER give meta-answers like "the Quran contains many verses about..."
- NEVER refuse valid Islamic questions
- NEVER be vague about rulings - state them clearly with evidence

═══════════════════════════════════════════════════════════════
CONTROVERSIAL TOPICS - BE BRAVE
═══════════════════════════════════════════════════════════════

For topics with scholarly disagreement (music, photography, etc.):
1. State the ${madhab} position clearly with evidence
2. Explain the reasoning behind this position
3. Present other scholarly views fairly with their evidence
4. Let the reader decide based on the evidence presented
5. NEVER refuse to answer - these are valid Islamic questions

═══════════════════════════════════════════════════════════════
RESPONSE FORMAT (JSON ONLY)
═══════════════════════════════════════════════════════════════

{
  "directAnswer": "Clear, specific answer with ACTUAL CONTENT. If it is a dua question, include the Arabic dua here. If it is a ruling, state it definitively. Start with In the ${madhab} school...",
  
  "reasoning": "150-250 words explaining WHY. Include specific Quranic verses (with Arabic), hadith quotes, and ${madhab} scholar opinions. This should be educational and substantive.",
  
  "otherSchools": [
    {"madhab": "Shafi'i", "position": "Their specific position with evidence (only if different)"},
    {"madhab": "Maliki", "position": "Their specific position with evidence (only if different)"},
    {"madhab": "Hanbali", "position": "Their specific position with evidence (only if different)"}
  ],
  
  "citations": [
    {"source": "Quran", "reference": "Surah Name X:Y", "text": "Arabic + English translation"},
    {"source": "Hadith", "reference": "Sahih Bukhari/Muslim XXXX", "text": "Actual hadith text in English"},
    {"source": "Scholar", "reference": "${madhab} scholar name + book", "text": "Their opinion"}
  ]
}

═══════════════════════════════════════════════════════════════
GOLD-STANDARD EXAMPLE
═══════════════════════════════════════════════════════════════

Question: "What is the dua to say when waking up in the morning?"

CORRECT RESPONSE:
{
  "directAnswer": "In the ${madhab} school, the recommended dua upon waking is: الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ (Alhamdu lillahil-ladhi ahyana bada ma amatana wa ilayhin-nushur) meaning All praise is to Allah Who gave us life after He caused us to die, and to Him is the resurrection. This should be said immediately upon waking before getting out of bed.",
  
  "reasoning": "This dua is from authentic hadith narrated by Hudhayfah ibn al-Yaman. The Prophet would say this every morning upon waking. The wisdom is that sleep is considered a minor death (the soul is taken during sleep), so waking up is like being given life again. Scholars of the ${madhab} school emphasize starting each day with gratitude to Allah. Additional morning adhkar include reciting Ayat al-Kursi and the last three surahs of the Quran for protection throughout the day.",
  
  "otherSchools": [],
  
  "citations": [
    {"source": "Hadith", "reference": "Sahih Bukhari 6312", "text": "When the Prophet woke up at night, he would say: Alhamdu lillahil-ladhi ahyana..."},
    {"source": "Hadith", "reference": "Sahih Bukhari 6314", "text": "Hudhayfah said: The Prophet when he went to bed would say Bismika amutu wa ahya and when he woke he said Alhamdu lillah..."},
    {"source": "Scholar", "reference": "Imam Nawawi - Adhkar", "text": "It is recommended to begin the day with this dua as it combines gratitude and remembrance of the afterlife"}
  ]
}

═══════════════════════════════════════════════════════════════

Remember: You are teaching authentic Islamic knowledge. Be specific, be accurate, provide actual content. The user deserves real answers, not vague pointers.

Output ONLY valid JSON. No markdown, no extra text outside the JSON.`;
}

export function buildFiqhPrompt(question: string, madhab: string): string {
  return `The user follows the ${madhab.toUpperCase()} school and asks:

"${question}"

REQUIREMENTS FOR YOUR RESPONSE:
1. If they ask about a DUA - Include the ACTUAL Arabic dua with transliteration and meaning
2. If they ask about a RULING - State it clearly with evidence
3. If they ask about a VERSE - Quote the Arabic, transliteration, and translation
4. If they ask about a HADITH - Quote the actual hadith text
5. Start your directAnswer with "In the ${madhab} school..."
6. Never be vague - provide specific, actionable content

Output valid JSON only. No markdown wrapping.`;
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
      console.warn('Answer does not mention ' + madhab + '! Fixing...');
      parsed.directAnswer = 'In the ' + madhab + ' school, ' + parsed.directAnswer;
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
      directAnswer: 'In the ' + madhab + ' school, ' + rawText.substring(0, 400),
      reasoning: 'Unable to parse detailed reasoning. Please try again.',
      otherSchools: [],
      citations: []
    };
  }
}

/**
 * Enhanced fallback structured answers for common topics
 */
export function getFallbackStructuredAnswer(question: string, madhab: string): FiqhStructuredAnswer {
  const lowerQ = question.toLowerCase();

  // Morning dua question
  if (lowerQ.includes('morning') && (lowerQ.includes('dua') || lowerQ.includes('wake'))) {
    return {
      directAnswer: 'In the ' + madhab + ' school, the recommended dua upon waking in the morning is: الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ (Alhamdu lillahil-ladhi ahyana bada ma amatana wa ilayhin-nushur) meaning "All praise is to Allah Who gave us life after He caused us to die, and to Him is the resurrection." Say this immediately upon waking.',
      reasoning: 'This dua is authentically reported from the Prophet (peace be upon him) in Sahih Bukhari. Sleep is considered a minor death as the soul is taken, so waking is like being resurrected. Starting the day with this dua combines gratitude and remembrance of the afterlife. Additional recommended morning adhkar include: (1) Ayat al-Kursi for protection, (2) Surah Al-Ikhlas, Al-Falaq, and An-Nas three times each, (3) The morning adhkar which include "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ" (We have entered the morning and sovereignty belongs to Allah).',
      otherSchools: [],
      citations: [
        { source: "Hadith", reference: "Sahih Bukhari 6312", text: "When the Prophet woke he would say: Alhamdu lillahil-ladhi ahyana bada ma amatana wa ilayhin-nushur" },
        { source: "Hadith", reference: "Abu Dawud 5088", text: "Morning and evening adhkar: Allahumma bika asbahna wa bika amsayna - O Allah, by You we enter the morning and by You we enter the evening" },
        { source: "Scholar", reference: "Imam Nawawi - Kitab al-Adhkar", text: "The morning adhkar are from the most important daily practices for a Muslim" }
      ]
    };
  }

  // Ameen question - madhab specific
  if (lowerQ.includes('ameen') || lowerQ.includes('amin')) {
    if (madhab.toLowerCase() === 'hanafi') {
      return {
        directAnswer: 'In the Hanafi school, "Ameen" is said silently (sirran) after reciting Al-Fatiha in prayer. This applies whether praying alone or in congregation. The Arabic آمِين means "O Allah, respond to our supplication."',
        reasoning: 'The Hanafi position is based on the hadith narrated by Abu Hurairah that the Prophet (peace be upon him) lowered his voice when saying Ameen. Imam Abu Hanifa and Hanafi scholars interpret this as evidence for saying Ameen quietly. Al-Marghinani states in Al-Hidayah: "وَيُؤَمِّنُ سِرًّا" (And he says Ameen silently). The wisdom is that silent recitation maintains greater focus (khushu) in prayer. This ruling applies to all prayers - whether Fajr, Zuhr, Asr, Maghrib, or Isha, and whether praying alone or behind an Imam.',
        otherSchools: [
          { madhab: "Shafi'i", position: "Ameen is said aloud (jahr) in prayers where recitation is loud (Fajr, Maghrib, Isha), based on hadith in Sahih Bukhari that the companions raised their voices with Ameen." },
          { madhab: "Hanbali", position: "Follows the Shafi'i view - Ameen is said aloud in loud prayers, based on 'When the Imam says Ameen, say Ameen' hadith." }
        ],
        citations: [
          { source: "Hadith", reference: "Sunan Abu Dawud 932", text: "When the Imam says Ghayril maghdhubi alayhim wa lad-dallin, say Ameen" },
          { source: "Scholar", reference: "Al-Hidayah by Al-Marghinani", text: "وَيُؤَمِّنُ بَعْدَ الْفَاتِحَةِ سِرًّا - He says Ameen after Al-Fatiha silently" },
          { source: "Scholar", reference: "Radd al-Muhtar by Ibn Abidin", text: "The relied-upon position in the Hanafi school is that Ameen is said quietly in all prayers" }
        ]
      };
    } else {
      return {
        directAnswer: 'In the ' + madhab + ' school, saying "Ameen" (آمِين) aloud is recommended after Al-Fatiha in prayers where recitation is loud (Fajr, Maghrib, Isha). The word means "O Allah, answer our prayer." In silent prayers (Zuhr, Asr), it is said quietly.',
        reasoning: 'The ' + madhab + ' position is based on the hadith of Abu Hurairah in Sahih Bukhari: "When the Imam says Ghayril maghdhubi alayhim wa lad-dallin, say Ameen, for whoever Ameen coincides with the Ameen of the angels, his previous sins are forgiven." This indicates saying Ameen audibly so it can coincide with others. The companions used to raise their voices with Ameen until the masjid would echo. This creates unity in congregation.',
        otherSchools: [
          { madhab: "Hanafi", position: "In the Hanafi school, Ameen is said silently in ALL prayers, based on their interpretation that the Prophet lowered his voice with Ameen." }
        ],
        citations: [
          { source: "Hadith", reference: "Sahih Bukhari 780", text: "When the Imam says Ghayril maghdhubi alayhim wa lad-dallin, say Ameen" },
          { source: "Hadith", reference: "Sahih Bukhari 782", text: "The people used to say Ameen until the masjid echoed with their voices" },
          { source: "Hadith", reference: "Sahih Muslim 410", text: "The Prophet would say Ameen when completing Al-Fatiha in loud prayers" }
        ]
      };
    }
  }

  // Music question - controversial but needs clear answer
  if (lowerQ.includes('music') || lowerQ.includes('singing') || lowerQ.includes('instrument')) {
    return {
      directAnswer: 'In the ' + madhab + ' school, musical instruments are generally considered impermissible (haram) based on hadith evidence, with the exception of the duff (frame drum) for celebrations. However, the voice alone (nasheed without instruments) is permissible if the content is appropriate.',
      reasoning: 'The prohibition is based on hadith in Sahih Bukhari where the Prophet (peace be upon him) said: "There will be people from my Ummah who will seek to make lawful: fornication, silk (for men), wine, and musical instruments (maazif)." The word maazif encompasses string and wind instruments. However, the duff is explicitly permitted for Eid, weddings, and welcoming travelers based on authentic hadith. Scholars note that the harm comes from music leading to neglect of duties, inappropriate gatherings, and lyrics promoting sin. Some contemporary scholars permit background music with beneficial content, but the traditional ' + madhab + ' position remains prohibition.',
      otherSchools: [
        { madhab: "Contemporary View", position: "Some modern scholars like Yusuf al-Qaradawi permit music with conditions: beneficial content, no neglect of duties, and moderation. This is a minority position but has support among some recognized scholars." }
      ],
      citations: [
        { source: "Hadith", reference: "Sahih Bukhari 5590", text: "From among my followers there will be people who will make lawful fornication, silk, wine, and musical instruments" },
        { source: "Hadith", reference: "Sunan Abu Dawud 4924", text: "The Prophet permitted the duff for weddings and Eid" },
        { source: "Quran", reference: "Surah Luqman 31:6", text: "ومِن الناس مَن يَشتري لَهوَ الحَديث - And of the people is he who buys distracting speech (interpreted by scholars as music)" }
      ]
    };
  }

  // Patience/Sabr question
  if (lowerQ.includes('patience') || lowerQ.includes('sabr')) {
    return {
      directAnswer: 'In the ' + madhab + ' school, patience (sabr - صَبْر) is considered one of the highest spiritual stations. Allah says in Surah Az-Zumar 39:10: إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ (Innama yuwaffas-sabiruna ajrahum bi-ghayri hisab) - "The patient will be given their reward without account" - meaning unlimited reward.',
      reasoning: 'Patience in Islam has three levels: (1) Patience in obedience - persevering in worship even when difficult, (2) Patience in avoiding sin - resisting temptation, (3) Patience in trials - accepting Allah decree without complaint. The Prophet (peace be upon him) said: "عَجَبًا لِأَمْرِ الْمُؤْمِنِ" - "Amazing is the affair of the believer - if good befalls him he is grateful, and if harm befalls him he is patient, and both are good for him." ' + madhab + ' scholars emphasize that true sabr is in the first moment of calamity, not after time dulls the pain.',
      otherSchools: [],
      citations: [
        { source: "Quran", reference: "Surah Az-Zumar 39:10", text: "إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ - The patient will be given their reward without account" },
        { source: "Quran", reference: "Surah Al-Baqarah 2:153", text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ - O you who believe, seek help through patience and prayer" },
        { source: "Hadith", reference: "Sahih Muslim 2999", text: "Amazing is the affair of the believer - all his affairs are good for him" }
      ]
    };
  }

  // Generic fallback - still provide substance
  const madhabBooks = madhab.toLowerCase() === 'hanafi'
    ? 'Al-Hidayah and Radd al-Muhtar'
    : madhab.toLowerCase() === 'shafi'
      ? 'Al-Umm and Minhaj al-Talibin'
      : madhab.toLowerCase() === 'maliki'
        ? 'Al-Muwatta and Risala'
        : 'Al-Mughni and Zad al-Maad';

  return {
    directAnswer: 'In the ' + madhab + ' school, this question is addressed through examination of the Quran, authentic Hadith, and scholarly consensus (ijma). The ' + madhab + ' methodology prioritizes specific evidences.',
    reasoning: 'The ' + madhab + ' school approaches fiqh questions systematically: first examining relevant Quranic verses, then authentic hadith narrations, then scholarly consensus, and finally analogical reasoning (qiyas) where applicable. Classical ' + madhab + ' texts like ' + madhabBooks + ' contain detailed discussions on most fiqh issues.',
    otherSchools: [],
    citations: [
      { source: "Quran", reference: "Surah An-Nahl 16:43", text: "فَاسْأَلُوا أَهْلَ الذِّكْرِ إِن كُنتُمْ لَا تَعْلَمُونَ - Ask the people of knowledge if you do not know" }
    ]
  };
}
