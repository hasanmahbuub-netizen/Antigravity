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
- NEVER give advisory wishy-washy answers like "it depends on your intention"
- NEVER hedge with "some scholars say this, but others say that" without giving the ${madhabUpper} position first

═══════════════════════════════════════════════════════════════
LIFESTYLE & SERIOUS QUESTIONS - BE DIRECT
═══════════════════════════════════════════════════════════════

For lifestyle, relationship, finance, and serious life questions:
1. Give a CLEAR RULING first - halal/haram/makruh/permissible with conditions
2. DO NOT give vague "advice" - give the Islamic RULING with evidence
3. Be direct: "This is permissible because..." or "This is prohibited because..."
4. For finance questions - state if it's halal/haram clearly
5. For relationship questions - give specific rules, not general advice
6. For food/lifestyle - state the ${madhabUpper} ruling definitively

WRONG: "It's best to be cautious and consider your circumstances..."
CORRECT: "In the ${madhabUpper} school, this is permissible. The evidence is..."

WRONG: "Some scholars allow it while others prohibit it..."
CORRECT: "In the ${madhabUpper} school, this is prohibited based on... However, the Shafi'i school permits it because..."

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

═══════════════════════════════════════════════════════════════
MANDATORY REQUIREMENTS - YOU MUST FOLLOW ALL OF THESE
═══════════════════════════════════════════════════════════════

1. START with a CLEAR RULING - use one of these formats:
   - "In the ${madhab} school, [X] is PERMISSIBLE (halal) because..."
   - "In the ${madhab} school, [X] is PROHIBITED (haram) because..."
   - "In the ${madhab} school, [X] is MAKRUH (disliked) because..."
   - "In the ${madhab} school, [X] is OBLIGATORY (wajib/fard) because..."
   - "In the ${madhab} school, [X] is RECOMMENDED (mustahab/sunnah) because..."

2. NEVER GIVE A GENERIC ANSWER like:
   - "This is addressed through examination of Quran and Hadith..." ❌ BANNED
   - "The ${madhab} methodology prioritizes evidences..." ❌ BANNED
   - "Scholars have different opinions..." ❌ BANNED (give the ruling first!)
   - "You should consult a scholar..." ❌ BANNED

3. ALWAYS INCLUDE:
   - The specific ruling (halal/haram/permissible/obligatory)
   - AT LEAST ONE specific condition or exception
   - AT LEAST ONE Quran verse OR hadith with actual Arabic text
   - Practical guidance the user can follow

4. FOR ANY TOPIC YOU DON'T KNOW:
   - Research using your training data to find the ${madhab} position
   - If truly unknown, still give the closest analogical ruling
   - NEVER return a generic "methodology" answer

5. EXAMPLES OF GOOD ANSWERS:
   - "In the ${madhab} school, keeping a dog as a pet is PROHIBITED unless for guarding, herding, or hunting..."
   - "In the ${madhab} school, tattoos are PROHIBITED (haram) because the Prophet said..."
   - "In the ${madhab} school, cryptocurrency trading is PERMISSIBLE with conditions: (1)..."

Output valid JSON only. No markdown wrapping. Make the directAnswer at least 50 words with real substance.`;
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
  // Try multiple methods to extract JSON
  let parsed: FiqhStructuredAnswer | null = null;

  // Method 1: Try direct parse after cleaning markdown
  let cleanText = rawText
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  // Method 2: Extract JSON object using regex if direct parse fails
  const jsonMatch = cleanText.match(/\{[\s\S]*"directAnswer"[\s\S]*\}/);
  if (jsonMatch) {
    cleanText = jsonMatch[0];
  }

  try {
    const parsedResult = JSON.parse(cleanText) as FiqhStructuredAnswer;
    parsed = parsedResult;

    // Check if directAnswer is itself a JSON string (double-wrapped)
    if (parsed && typeof parsed.directAnswer === 'string' && parsed.directAnswer.includes('"directAnswer"')) {
      try {
        const innerMatch = parsed.directAnswer.match(/\{[\s\S]*\}/);
        if (innerMatch) {
          const innerParsed = JSON.parse(innerMatch[0]) as FiqhStructuredAnswer;
          if (innerParsed.directAnswer) {
            parsed = innerParsed;
          }
        }
      } catch {
        // Keep outer parsed if inner parse fails
      }
    }
  } catch (e1) {
    // Method 3: Try to find any valid JSON in the response
    try {
      const allJsonMatches = rawText.match(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g);
      if (allJsonMatches) {
        for (const match of allJsonMatches) {
          try {
            const testParse = JSON.parse(match);
            if (testParse.directAnswer) {
              parsed = testParse;
              break;
            }
          } catch {
            continue;
          }
        }
      }
    } catch {
      // All methods failed
    }
  }

  // If we got a valid parsed response
  if (parsed && parsed.directAnswer && typeof parsed.directAnswer === 'string') {
    // Validate madhab is mentioned
    if (!parsed.directAnswer.toLowerCase().includes(madhab.toLowerCase())) {
      console.warn('Answer does not mention ' + madhab + '! Fixing...');
      parsed.directAnswer = 'In the ' + madhab + ' school, ' + parsed.directAnswer;
    }

    // Filter out user's madhab from otherSchools
    const filteredSchools = Array.isArray(parsed.otherSchools)
      ? parsed.otherSchools.filter((s: { madhab?: string; position: string }) =>
        s.madhab?.toLowerCase() !== madhab.toLowerCase()
      )
      : [];

    return {
      directAnswer: parsed.directAnswer,
      reasoning: parsed.reasoning || 'Detailed reasoning not available.',
      otherSchools: filteredSchools,
      citations: Array.isArray(parsed.citations) ? parsed.citations : []
    };
  }

  // Fallback: try to extract answer from raw text
  console.error('JSON parse failed, using fallback structure');

  // Try to extract useful content from raw text
  const answerMatch = rawText.match(/"directAnswer"\s*:\s*"([^"]+)"/);
  const directAnswer = answerMatch
    ? answerMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"')
    : rawText.substring(0, 400);

  return {
    directAnswer: 'In the ' + madhab + ' school, ' + directAnswer,
    reasoning: 'Unable to parse detailed reasoning. Please try again.',
    otherSchools: [],
    citations: []
  };
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

  // Stock Trading / Investment questions - COMMON QUESTION, NEEDS CLEAR ANSWER
  if (lowerQ.includes('stock') || lowerQ.includes('shares') || lowerQ.includes('trading') || lowerQ.includes('invest') || lowerQ.includes('cryptocurrency') || lowerQ.includes('bitcoin') || lowerQ.includes('forex')) {
    return {
      directAnswer: 'In the ' + madhab + ' school, stock trading is PERMISSIBLE (halal) with specific conditions: (1) The company\'s primary business must be halal - not alcohol, gambling, pork, interest-based banking, or weapons. (2) The company should not have excessive debt (debt less than 33% of assets). (3) Interest-bearing income should be less than 5% of total revenue. (4) You must purify any interest income by donating that portion to charity. Day trading with speculation (gambling-like) is discouraged, but long-term investment is encouraged.',
      reasoning: 'The permissibility is based on the principle that buying shares means owning a portion of a company - which is a form of partnership (musharakah). The Prophet (peace be upon him) engaged in trade and partnerships. However, certain industries are prohibited: riba (interest-based finance like conventional banks), alcohol, gambling, pork, and weapons. Many scholars have established screening criteria: (1) Primary halal business, (2) Debt-to-assets ratio below 33%, (3) Interest income below 5%. AAOIFI and scholars like Mufti Taqi Usmani have published detailed guidelines. For cryptocurrencies like Bitcoin, there is scholarly debate - some permit it as digital property/commodity, others prohibit due to speculation. The ' + madhab + ' approach emphasizes avoiding gharar (excessive uncertainty) and gambling-like speculation.',
      otherSchools: [
        { madhab: "Contemporary Scholars", position: "Organizations like AAOIFI have published specific halal stock screening criteria. Many Islamic index funds (like S&P Shariah Index) follow these guidelines. Cryptocurrency rulings vary - some scholars permit, others prohibit." }
      ],
      citations: [
        { source: "Hadith", reference: "Sahih Bukhari", text: "The Prophet (peace be upon him) said: The truthful, trustworthy merchant will be with the prophets, the truthful, and the martyrs on the Day of Resurrection" },
        { source: "Scholar", reference: "Mufti Taqi Usmani - Fiqh of Islamic Finance", text: "Stock ownership represents real ownership in a company and is permissible if the company\'s business is halal" },
        { source: "Quran", reference: "Surah Al-Baqarah 2:275", text: "Allah has permitted trade and forbidden interest (riba)" }
      ]
    };
  }

  // Zakat / Nisab questions - CRITICAL: This was failing!
  if (lowerQ.includes('zakat') || lowerQ.includes('nisab') || lowerQ.includes('zakah') || lowerQ.includes('charity') || lowerQ.includes('2.5%') || lowerQ.includes('poor due')) {
    return {
      directAnswer: 'In the ' + madhab + ' school, the Nisab (minimum threshold for Zakat) is the value of 87.48 grams of gold OR 612.36 grams of silver. When your wealth exceeds this threshold for one lunar year, Zakat becomes OBLIGATORY (fard) at 2.5% annually. Using the silver standard is more common as it results in a lower threshold, meaning more people qualify to pay Zakat.',
      reasoning: 'Nisab is based on the Prophet\'s hadith: "No Zakat is due on property mounting to less than five Uqiya (ounces of silver) and no Zakat is due on less than five camels..." (Sahih Bukhari). The gold Nisab equals 20 Dinars (87.48g gold), and silver equals 200 Dirhams (612.36g silver). ' + madhab + ' scholars generally recommend using the silver standard to help more poor people receive Zakat. Zakat is due on: cash, gold/silver, business inventory, stocks (at market value), and other tradeable assets. It is NOT due on personal items like your house, car, or clothes. The 2.5% rate applies to most assets, but agricultural produce has different rates (5-10%).',
      otherSchools: [
        { madhab: "Modern Application", position: "Today, you can calculate Nisab by checking current gold/silver prices. Silver Nisab is typically around $400-500 USD, while gold Nisab is around $5,000-6,000 USD depending on market prices." }
      ],
      citations: [
        { source: "Hadith", reference: "Sahih Bukhari 1405", text: "No Zakat is due on less than five Uqiya (ounces) of silver" },
        { source: "Hadith", reference: "Sunan Abu Dawud 1573", text: "The Prophet fixed Zakat at: one fortieth (2.5%) of gold and silver" },
        { source: "Quran", reference: "Surah At-Tawbah 9:60", text: "إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ - Zakat is only for the poor and needy..." }
      ]
    };
  }

  // Mortgage / Riba / Interest questions
  if (lowerQ.includes('mortgage') || lowerQ.includes('interest') || lowerQ.includes('riba') || lowerQ.includes('loan') || lowerQ.includes('bank') || lowerQ.includes('credit')) {
    return {
      directAnswer: 'In the ' + madhab + ' school, conventional mortgages with interest (riba) are PROHIBITED (haram). Interest is one of the major sins in Islam. However, Islamic alternatives exist: (1) Murabaha - the bank buys the property and sells it to you at a markup, (2) Ijara - Islamic leasing, (3) Diminishing Musharakah - gradual ownership transfer. Some scholars permit conventional mortgages only in case of extreme necessity (darurah) where Islamic alternatives are unavailable.',
      reasoning: 'The prohibition of riba is established by: Quran (2:275-279) "Allah has permitted trade and forbidden riba", and multiple hadith including "The Prophet cursed the one who consumes riba, the one who pays it, the one who writes it down, and the two witnesses to it" (Sahih Muslim). ' + madhab + ' scholars are unanimous that conventional interest-based mortgages are prohibited. However, there is scholarly discussion about: (1) The severe housing need in Western countries, (2) Whether renting is a viable long-term alternative. Some scholars like Yusuf al-Qaradawi have issued rulings allowing mortgages for primary residence under specific conditions of necessity, but this remains a minority position. The preferred approach is always to seek Islamic financing alternatives.',
      otherSchools: [
        { madhab: "Minority View", position: "Some scholars permit conventional mortgages for primary residence if: (1) No Islamic alternative available, (2) It's for necessity not luxury, (3) You intend to switch to Islamic financing when available." }
      ],
      citations: [
        { source: "Quran", reference: "Surah Al-Baqarah 2:275", text: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا - Allah has permitted trade and forbidden riba (interest)" },
        { source: "Quran", reference: "Surah Al-Baqarah 2:278-279", text: "Fear Allah and give up what remains of riba if you are believers. If you do not, then be warned of war from Allah and His Messenger" },
        { source: "Hadith", reference: "Sahih Muslim 1598", text: "The Prophet cursed the one who consumes riba, the one who pays it, the one who writes it, and the two witnesses" }
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

  // Generic fallback - urge specific question instead of methodology answer
  return {
    directAnswer: 'In the ' + madhab + ' school, I need more specific details to give you a clear halal/haram ruling. Please rephrase your question to be more specific. For example, instead of asking generally about "business," ask "Is dropshipping halal?" or "Is taking a bank loan for a house halal?" I will then provide you with the specific ' + madhab + ' ruling with evidence from Quran and Hadith.',
    reasoning: 'The ' + madhab + ' school provides specific rulings for specific situations. General questions may have different answers depending on the exact circumstances. For example, buying and selling is halal, but selling alcohol is haram. Please provide: (1) The specific action you want to know about, (2) The context or purpose, (3) Any relevant details. I will then give you a clear ruling with evidence.',
    otherSchools: [],
    citations: [
      { source: "Quran", reference: "Surah Al-Baqarah 2:275", text: "وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا - Allah has permitted trade and forbidden interest" },
      { source: "Hadith", reference: "Sahih Muslim", text: "What is halal is clear and what is haram is clear, and between them are doubtful matters" }
    ]
  };
}
