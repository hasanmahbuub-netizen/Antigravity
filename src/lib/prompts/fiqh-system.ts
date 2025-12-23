/**
 * IMANOS Fiqh System Prompt V2
 * Comprehensive educational Islamic answers with citations
 */

export const FIQH_SYSTEM_PROMPT = `
You are an expert Islamic scholar providing comprehensive educational answers.

## OUTPUT FORMAT (follow exactly):

### Direct Answer
[2-3 sentence summary from {MADHAB} perspective]

### Evidence from Quran & Hadith
**Quran:** [Specific verse with citation, e.g., "Surah Al-Baqarah 2:183"]
**Hadith:** [Authentic Hadith with citation, e.g., "Sahih Bukhari 1905"]

### {MADHAB} School Position
[Detailed explanation with reasoning from {MADHAB} scholars]

### Other Schools' Views (if different)
- Shafi'i: [Their view]
- Maliki: [Their view]  
- Hanbali: [Their view]

### Practical Application
[How to apply in daily life with examples]

📚 This is educational information. For personal guidance, consult a qualified scholar.

## RULES:
✅ Always cite specific sources (verse numbers, Hadith numbers, scholar names)
✅ Explain reasoning, not just rulings
✅ Be thorough (aim for 300-500 words)
✅ Acknowledge when scholars disagree
❌ Never refuse educational questions
❌ Never say "ask a mufti" - you're a teacher, not a mufti
`.trim();

export function buildFiqhPrompt(question: string, madhab: string): string {
  return `
User follows ${madhab} school and asks:
"${question}"

Provide a comprehensive answer with:
1. ${madhab} position with Quran/Hadith evidence
2. Scholarly reasoning
3. Other madhabs' views if different
4. Practical guidance

Be thorough and cite sources specifically.
  `.trim();
}

export const FIQH_FALLBACK_ANSWERS: Record<string, (madhab: string) => string> = {
  prayer: (madhab) => `
### Direct Answer
In the ${madhab} school, the five daily prayers are obligatory (fard) upon every sane, adult Muslim. Missing them intentionally is a major sin.

### Evidence from Quran & Hadith
**Quran:** "Establish prayer. Indeed, prayer prohibits immorality and wrongdoing" (Surah Al-Ankabut 29:45)
**Hadith:** "The first thing for which a servant will be held accountable on the Day of Judgment is prayer" (Sunan an-Nasa'i 465)

### ${madhab} School Position
The ${madhab} school holds that the five prayers are: Fajr (2 rak'at), Dhuhr (4 rak'at), Asr (4 rak'at), Maghrib (3 rak'at), and Isha (4 rak'at). Each prayer has its specific time window and conditions for validity including wudu, facing qibla, and covering awrah.

### Other Schools' Views
All four schools agree on the obligation of five daily prayers. Minor differences exist in details like the position of hands during qiyam.

### Practical Application
Set alarms for each prayer time. Start with Fajr and maintain consistency. If you miss a prayer, make it up as soon as you remember.

📚 This is educational information. For personal guidance, consult a qualified scholar.
  `.trim(),

  wudu: (madhab) => `
### Direct Answer
According to ${madhab} jurisprudence, wudu (ablution) is a prerequisite for prayer and consists of washing specific body parts in a specific order.

### Evidence from Quran & Hadith
**Quran:** "O you who believe, when you rise for prayer, wash your faces and your hands up to the elbows, wipe over your heads, and wash your feet up to the ankles" (Surah Al-Ma'idah 5:6)
**Hadith:** "Allah does not accept the prayer without purification" (Sahih Muslim 224)

### ${madhab} School Position
The obligatory (fard) acts in ${madhab} wudu are:
1. Washing the entire face once
2. Washing both arms including elbows
3. Wiping at least 1/4 of the head
4. Washing both feet including ankles

Sunnah acts include: saying Bismillah, washing hands first, using miswak, washing each part three times.

### What Breaks Wudu
- Anything exiting from the private parts
- Sleep (lying down)
- Loss of consciousness
- Touching private parts directly (varies by madhab)

### Practical Application
Learn the sequence: hands, mouth, nose, face, arms, head, ears, feet. Make wudu slowly and mindfully, reflecting on purifying the soul.

📚 This is educational information. For personal guidance, consult a qualified scholar.
  `.trim(),

  fasting: (madhab) => `
### Direct Answer
Fasting in Ramadan is one of the five pillars of Islam, obligatory upon every sane, adult Muslim who is able.

### Evidence from Quran & Hadith
**Quran:** "O you who believe, fasting is prescribed for you as it was prescribed for those before you, that you may become righteous" (Surah Al-Baqarah 2:183)
**Hadith:** "Whoever fasts Ramadan with faith and seeking reward, his previous sins will be forgiven" (Sahih Bukhari 38)

### ${madhab} School Position
Fasting begins at Fajr (true dawn) and ends at Maghrib (sunset). The fast is broken by:
- Intentional eating or drinking
- Sexual intercourse
- Deliberate vomiting
- Menstruation or post-childbirth bleeding

What does NOT break the fast:
- Eating or drinking forgetfully
- Swallowing saliva
- Eye drops, ear drops (opinion varies)
- Blood tests, injections (non-nutritive)

### Practical Application
Begin with suhoor before Fajr. Break fast immediately at Maghrib with dates and water. Focus on increasing Quran recitation and charity during Ramadan.

📚 This is educational information. For personal guidance, consult a qualified scholar.
  `.trim(),

  zakat: (madhab) => `
### Direct Answer
Zakat is obligatory charity (2.5% of savings) due when wealth reaches nisab and one lunar year passes.

### Evidence from Quran & Hadith
**Quran:** "Take from their wealth a charity to purify and sanctify them" (Surah At-Tawbah 9:103)
**Hadith:** "Islam is built on five pillars... and giving Zakat" (Sahih Bukhari 8)

### ${madhab} School Position
Zakat is due on:
- Gold: 87.48 grams (nisab)
- Silver: 612.36 grams (nisab)
- Cash: equivalent to silver nisab
- Trade goods: market value
- Agricultural produce: 5-10%

Recipients (8 categories from Quran 9:60):
1. The poor (Fuqara)
2. The needy (Masakin)
3. Zakat collectors
4. Those whose hearts are to be reconciled
5. Freeing slaves
6. Those in debt
7. In the cause of Allah
8. Travelers in need

### Practical Application
Calculate your zakatable assets annually. Use a zakat calculator. Give to local organizations or directly to those in need in your community.

📚 This is educational information. For personal guidance, consult a qualified scholar.
  `.trim(),

  ameen: (madhab) => `
### Direct Answer
In the ${madhab} school, "Ameen" is said after Surah Al-Fatiha in prayer, with specific guidelines on whether to say it aloud or silently.

### Evidence from Quran & Hadith
**Hadith:** "When the Imam says 'Ameen', say 'Ameen', for whoever's Ameen coincides with the Ameen of the angels, his previous sins will be forgiven" (Sahih Bukhari 782)
**Hadith:** "When the Imam finishes reciting Al-Fatiha, say Ameen" (Sahih Muslim 410)

### ${madhab} School Position
In the Hanafi school:
- Ameen is said **silently** (sirran) by both imam and followers
- It is said immediately after "wa la dhaalleen"
- This is based on the Hadith that the Prophet ﷺ said it silently

In the Shafi'i and Hanbali schools:
- Ameen is said **aloud** (jahran) in prayers recited aloud
- The congregation says it together with or after the imam

### Other Schools' Views
- **Shafi'i/Hanbali:** Ameen is said aloud in Fajr, Maghrib, and Isha
- **Maliki:** Similar to Hanafi, Ameen is said silently
- All agree it is highly recommended (sunnah mu'akkadah)

### Practical Application
Follow the practice of your local community and imam. The reward is in the sincerity, regardless of volume. When praying alone, you may say it either way.

📚 This is educational information. For personal guidance, consult a qualified scholar.
  `.trim(),

  general: (madhab) => `
### Direct Answer
This question touches on important aspects of Islamic jurisprudence that scholars have discussed extensively.

### Evidence from Quran & Hadith
**Quran:** "Ask the people of knowledge if you do not know" (Surah An-Nahl 16:43)
**Hadith:** "Seeking knowledge is an obligation upon every Muslim" (Ibn Majah 224)

### ${madhab} School Position
The ${madhab} school, like all four Sunni madhabs, bases its rulings on:
1. The Quran - the primary source
2. Authentic Hadith (Sunnah)
3. Scholarly consensus (Ijma')
4. Analogical reasoning (Qiyas)

Each madhab has developed detailed methodologies for deriving rulings, and following one consistently is recommended for laypeople.

### Practical Application
- Study the basics of your madhab
- Consult learned scholars in your community
- Use reputable resources like SeekersGuidance or IslamQA
- When madhabs differ, follow what your local scholars advise

📚 This is educational information. For personal guidance, consult a qualified scholar.
  `.trim()
};

export function getFallbackAnswer(question: string, madhab: string): string {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('ameen') || lowerQuestion.includes('amin')) {
    return FIQH_FALLBACK_ANSWERS.ameen(madhab);
  }
  if (lowerQuestion.includes('pray') || lowerQuestion.includes('salah') || lowerQuestion.includes('namaz')) {
    return FIQH_FALLBACK_ANSWERS.prayer(madhab);
  }
  if (lowerQuestion.includes('wudu') || lowerQuestion.includes('ablution') || lowerQuestion.includes('wudhu')) {
    return FIQH_FALLBACK_ANSWERS.wudu(madhab);
  }
  if (lowerQuestion.includes('fast') || lowerQuestion.includes('ramadan') || lowerQuestion.includes('sawm') || lowerQuestion.includes('roza')) {
    return FIQH_FALLBACK_ANSWERS.fasting(madhab);
  }
  if (lowerQuestion.includes('zakat') || lowerQuestion.includes('charity') || lowerQuestion.includes('zakah')) {
    return FIQH_FALLBACK_ANSWERS.zakat(madhab);
  }

  return FIQH_FALLBACK_ANSWERS.general(madhab);
}
