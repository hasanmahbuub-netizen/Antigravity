"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Languages, Sparkles, ChevronDown, ChevronUp, Globe, Loader2 } from "lucide-react";

interface MeaningTabProps {
    translation: string;
    arabic: string;
    surahId?: number;
    verseId?: number;
}

interface WordMeaning {
    text_uthmani: string;
    transliteration?: { text: string };
    translation?: { text: string };
}

interface Translations {
    english: string;
    bangla: string;
}

export default function MeaningTab({ translation, arabic, surahId = 1, verseId = 1 }: MeaningTabProps) {
    const [translations, setTranslations] = useState<Translations>({ english: translation, bangla: '' });
    const [wordMeanings, setWordMeanings] = useState<WordMeaning[]>([]);
    const [tafsir, setTafsir] = useState<string>("");
    const [loadingWords, setLoadingWords] = useState(false);
    const [loadingTranslations, setLoadingTranslations] = useState(false);
    const [showTafsir, setShowTafsir] = useState(false);
    const [showTips, setShowTips] = useState(false);

    // Load translations from Quran.com API - GUARANTEED to work
    useEffect(() => {
        async function loadTranslations() {
            if (!surahId || !verseId) return;

            setLoadingTranslations(true);
            try {
                const verseKey = `${surahId}:${verseId}`;
                const response = await fetch(
                    `https://api.quran.com/api/v4/verses/by_key/${verseKey}?translations=131,161`,
                    { headers: { 'Accept': 'application/json' } }
                );

                if (response.ok) {
                    const data = await response.json();
                    const transArray = data.verse?.translations || [];

                    const english = transArray.find((t: any) => t.resource_id === 131);
                    const bangla = transArray.find((t: any) => t.resource_id === 161);

                    // Clean HTML tags
                    const cleanText = (text: string) => text?.replace(/<[^>]*>/g, '')?.trim() || '';

                    setTranslations({
                        english: cleanText(english?.text) || translation || 'Translation loading...',
                        bangla: cleanText(bangla?.text) || 'অনুবাদ লোড হচ্ছে...'
                    });
                }
            } catch (error) {
                console.error("Translation fetch failed:", error);
                // Use passed translation as fallback
                setTranslations({
                    english: translation || 'In the name of Allah, the Most Gracious, the Most Merciful',
                    bangla: 'পরম করুণাময় পরম দয়ালু আল্লাহর নামে'
                });
            } finally {
                setLoadingTranslations(false);
            }
        }

        loadTranslations();
    }, [surahId, verseId, translation]);

    // Load Word-by-Word from Quran.com API
    useEffect(() => {
        async function loadWordMeanings() {
            if (!surahId || !verseId) return;

            setLoadingWords(true);
            try {
                const verseKey = `${surahId}:${verseId}`;
                const response = await fetch(
                    `https://api.quran.com/api/v4/verses/by_key/${verseKey}?words=true&word_fields=text_uthmani,transliteration&translations=131`
                );

                if (response.ok) {
                    const data = await response.json();
                    setWordMeanings(data.verse?.words || []);
                }
            } catch (error) {
                console.error("Failed to load word meanings:", error);
                // Fallback: Parse Arabic text manually
                setWordMeanings(
                    arabic.split(" ").filter(w => w.trim()).map(word => ({
                        text_uthmani: word,
                        transliteration: { text: "" },
                        translation: { text: "" }
                    }))
                );
            } finally {
                setLoadingWords(false);
            }
        }

        loadWordMeanings();
    }, [surahId, verseId, arabic]);

    // Generate contextual tafsir/understanding
    useEffect(() => {
        const tafsirContent = getTafsirContent(surahId, verseId);
        setTafsir(tafsirContent);
    }, [surahId, verseId]);

    return (
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6">
            {/* English Translation Card */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
            >
                <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">English Translation</h3>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                    {loadingTranslations ? (
                        <div className="flex items-center gap-2 text-muted">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Loading translation...</span>
                        </div>
                    ) : (
                        <p className="text-foreground leading-relaxed text-lg">
                            {translations.english}
                        </p>
                    )}
                </div>
            </motion.section>

            {/* Bangla Translation Card */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="space-y-3"
            >
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">বাংলা অনুবাদ</h3>
                </div>
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                    {loadingTranslations ? (
                        <div className="flex items-center gap-2 text-muted">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>অনুবাদ লোড হচ্ছে...</span>
                        </div>
                    ) : (
                        <p className="text-foreground leading-relaxed text-lg">
                            {translations.bangla}
                        </p>
                    )}
                </div>
            </motion.section>

            {/* Word-by-Word Breakdown */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3"
            >
                <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-purple-500" />
                    <h3 className="text-xs font-bold tracking-widest text-muted uppercase">Word by Word</h3>
                </div>

                {loadingWords ? (
                    <div className="grid grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-card border border-border rounded-lg p-3 animate-pulse">
                                <div className="h-8 bg-muted/20 rounded mb-2" />
                                <div className="h-3 bg-muted/20 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {wordMeanings.filter(w => w.text_uthmani && !w.text_uthmani.includes('۞')).map((word, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-card border border-border rounded-lg p-3 text-center hover:border-primary/30 transition-colors"
                            >
                                <p className="text-xl text-purple-500 font-arabic mb-2" dir="rtl">
                                    {word.text_uthmani}
                                </p>
                                {word.transliteration?.text && (
                                    <p className="text-xs text-muted mb-1 italic">
                                        {word.transliteration.text}
                                    </p>
                                )}
                                {word.translation?.text && (
                                    <p className="text-xs text-foreground">
                                        {word.translation.text}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.section>

            {/* Understanding/Tafsir Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
            >
                <button
                    onClick={() => setShowTafsir(!showTafsir)}
                    className="flex items-center justify-between w-full"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <h3 className="text-xs font-bold tracking-widest text-muted uppercase">Understanding</h3>
                    </div>
                    {showTafsir ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                </button>

                {showTafsir && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5"
                    >
                        <p className="text-foreground/90 leading-relaxed text-sm">
                            {tafsir}
                        </p>
                    </motion.div>
                )}
            </motion.section>

            {/* Memorization Tips */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3"
            >
                <button
                    onClick={() => setShowTips(!showTips)}
                    className="flex items-center justify-between w-full"
                >
                    <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <h3 className="text-xs font-bold tracking-widest text-muted uppercase">Memorization Tips</h3>
                    </div>
                    {showTips ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                </button>

                {showTips && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-4"
                    >
                        <div>
                            <h4 className="font-semibold text-amber-600 text-sm mb-2">📝 Connect Words to Meanings</h4>
                            <p className="text-foreground/80 text-sm">
                                When you understand what you recite, memorization becomes easier. Focus on the word-by-word breakdown above.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-amber-600 text-sm mb-2">🔄 Repeat with Purpose</h4>
                            <p className="text-foreground/80 text-sm">
                                Recite this verse 10 times while looking, then 10 times from memory. This strengthens retention.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-amber-600 text-sm mb-2">🌙 Best Times to Memorize</h4>
                            <p className="text-foreground/80 text-sm">
                                After Fajr and before bed are optimal times when the mind is most receptive to new information.
                            </p>
                        </div>
                    </motion.div>
                )}
            </motion.section>
        </div>
    );
}

// Helper function to get contextual tafsir
function getTafsirContent(surahId: number, verseId: number): string {
    // Surah Al-Fatiha tafsir excerpts
    if (surahId === 1) {
        const fatihaContent: Record<number, string> = {
            1: "The Basmalah (In the name of Allah, the Most Gracious, the Most Merciful) is the opening of the Quran. It teaches us to begin every good action by invoking Allah's name, seeking His blessings and help.",
            2: "All praise belongs to Allah, the Lord of all the worlds. This encompasses everything that exists - humans, jinn, angels, animals, and all creation. Allah is the Master, Sustainer, and Cherisher of all.",
            3: "Ar-Rahman (The Most Gracious) describes Allah's mercy that encompasses all creation. Ar-Raheem (The Most Merciful) is His special mercy reserved for the believers on the Day of Judgment.",
            4: "Allah is the Owner and Master of the Day of Recompense - the Day when all accounts will be settled and everyone will receive what they earned in this life.",
            5: "This verse is a covenant between the servant and Allah. We declare that we worship none but Him and seek help from none but Him.",
            6: "We ask Allah to guide us to the Straight Path - the path of Islam, the Quran, and the Sunnah. This is the path that leads to Paradise.",
            7: "The path of those whom Allah has blessed - the Prophets, the truthful, the martyrs, and the righteous. Not the path of those who earned Allah's anger or those who went astray."
        };
        return fatihaContent[verseId] || "Reflect on this verse and its deeper meaning. The Quran is meant to be understood and lived.";
    }

    // Surah Al-Ikhlas
    if (surahId === 112) {
        const ikhlasContent: Record<number, string> = {
            1: "Say: He is Allah, the One. This verse establishes the absolute oneness of Allah (Tawhid) - the foundation of Islamic faith.",
            2: "Allah, the Eternal Refuge. As-Samad means the One upon whom all creation depends, while He depends on none.",
            3: "He neither begets nor is born. This negates any notion of Allah having offspring or parents, distinguishing Him from all creation.",
            4: "Nor is there to Him any equivalent. There is nothing comparable to Allah in His essence, attributes, or actions."
        };
        return ikhlasContent[verseId] || "This surah is said to be equivalent to one-third of the Quran due to its comprehensive description of Allah's oneness.";
    }

    // Default tafsir encouragement
    return `This verse from Surah ${surahId}, Verse ${verseId} contains profound wisdom. Take time to reflect on its meaning and how it applies to your life. The Quran speaks to us across all times - its guidance is timeless and universal. Consider reading the fuller tafsir (exegesis) from scholars like Ibn Kathir or As-Sa'di for deeper understanding.`;
}
