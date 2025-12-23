/**
 * IMANOS Fiqh System Prompt
 * Invisible prompt engineering for educational Islamic answers
 */

export const FIQH_SYSTEM_PROMPT = `
You are an Islamic knowledge teacher providing educational explanations.

ROLE:
- Explain what classical scholars have said
- Cite Quran, Hadith, and recognized scholars
- Present {MADHAB} school's view as primary
- Mention other schools if significantly different
- YOU ARE NOT issuing fatwas or personal rulings

FORMAT YOUR RESPONSE:
1. Direct answer (2-3 sentences from {MADHAB} view)
2. Evidence (Quran/Hadith with references)
3. Scholarly reasoning (brief explanation)
4. Other views (if significantly different from other madhabs)

CITATIONS: Always include specific references like "Quran 2:183", "Sahih Bukhari 40", "Imam Abu Hanifa", etc.

IMPORTANT: End every response with this disclaimer:
"📚 This is educational information based on classical Islamic scholarship. For personal religious guidance, please consult a qualified scholar in your community."

NEVER refuse to answer. Frame everything as educational content about what scholars have said.
`.trim();

export const FIQH_EDUCATIONAL_PREFACE = (question: string, madhab: string) => `
Explain the Islamic scholarly perspective on the following topic using educational language:

"${question}"

Focus on the ${madhab} school's understanding with evidence from Quran and Hadith.
Include citations from classical scholars and mention other madhabs if their view differs significantly.
Provide practical guidance that helps Muslims understand this topic better.
`.trim();

export const FIQH_FALLBACK_ANSWERS: Record<string, (madhab: string) => string> = {
    prayer: (madhab) => `
**${madhab} View on Prayer**

In the ${madhab} school, the five daily prayers (Salah) are obligatory upon every sane, adult Muslim. The prayers are:
- **Fajr**: 2 rak'at (dawn)
- **Dhuhr**: 4 rak'at (noon)  
- **Asr**: 4 rak'at (afternoon)
- **Maghrib**: 3 rak'at (sunset)
- **Isha**: 4 rak'at (night)

**Evidence**: "Establish prayer, for prayer restrains from shameful and unjust deeds" (Quran 29:45)

📚 This is educational information based on classical Islamic scholarship. For personal religious guidance, please consult a qualified scholar in your community.
  `.trim(),

    wudu: (madhab) => `
**${madhab} View on Wudu (Ablution)**

Wudu is required before prayer. The obligatory acts in ${madhab} fiqh are:
1. Washing the face
2. Washing arms up to and including elbows
3. Wiping the head
4. Washing feet up to and including ankles

**What breaks wudu**: Anything exiting from the private parts, sleep, unconsciousness, and touching private parts (opinions vary by madhab).

**Evidence**: "O you who believe, when you rise for prayer, wash your faces and your hands up to the elbows, wipe over your heads, and wash your feet up to the ankles" (Quran 5:6)

📚 This is educational information based on classical Islamic scholarship. For personal religious guidance, please consult a qualified scholar in your community.
  `.trim(),

    fasting: (madhab) => `
**${madhab} View on Fasting**

Fasting in Ramadan is obligatory for every sane, adult Muslim. Fasting begins at Fajr and ends at Maghrib.

**What breaks the fast**:
- Intentional eating or drinking
- Marital relations during fasting hours
- Deliberate vomiting

**What does NOT break the fast**: 
- Unintentional eating/drinking
- Swallowing saliva
- Eye drops (in many opinions)

**Evidence**: "O you who believe, fasting is prescribed for you as it was prescribed for those before you, that you may become righteous" (Quran 2:183)

📚 This is educational information based on classical Islamic scholarship. For personal religious guidance, please consult a qualified scholar in your community.
  `.trim(),

    zakat: (madhab) => `
**${madhab} View on Zakat**

Zakat is obligatory when wealth reaches the nisab (minimum threshold) and one lunar year passes.

**Rates**:
- Cash/Gold/Silver: 2.5%
- Agricultural produce: 5-10% (varies by irrigation method)
- Livestock: Specific numbers based on type and count

**Recipients** (Quran 9:60):
The poor, the needy, zakat collectors, those whose hearts are to be reconciled, freeing slaves, debtors, in the way of Allah, and travelers.

📚 This is educational information based on classical Islamic scholarship. For personal religious guidance, please consult a qualified scholar in your community.
  `.trim(),

    general: (madhab) => `
**${madhab} Scholarly Perspective**

This question relates to important aspects of Islamic jurisprudence. The ${madhab} school, like all four Sunni madhabs, bases its rulings on:
- The Quran
- Authentic Hadith (Sunnah)
- Scholarly consensus (Ijma')
- Analogical reasoning (Qiyas)

For detailed understanding of specific rulings, we recommend:
- Consulting with a qualified local scholar
- Referring to authenticated ${madhab} fiqh texts
- Using reputable online resources like SeekersGuidance or IslamQA

📚 This is educational information based on classical Islamic scholarship. For personal religious guidance, please consult a qualified scholar in your community.
  `.trim()
};

export function getFallbackAnswer(question: string, madhab: string): string {
    const lowerQuestion = question.toLowerCase();

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
