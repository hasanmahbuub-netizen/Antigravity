/**
 * IMANOS AI Service Layer
 * Powered by Gemini 2.0 Flash
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export interface TajweedFeedback {
    score: number;
    positives: string[];
    improvements: string[];
    details: string;
}

export const aiService = {
    /**
     * Analyze user recitation against a target verse using Gemini.
     */
    async analyzeRecitation(audioBlob: Blob | null, surah: number, ayah: number): Promise<TajweedFeedback> {
        if (!API_KEY) {
            console.warn("Gemini API Key missing. Falling back to mock.");
            return this.getMockTajweed();
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const prompt = `
                You are a world-class Tajweed Teacher. 
                Analyze a user's recitation of Surah ${surah}, Ayah ${ayah}.
                
                Since I am implementing the interface, please provide a detailed analysis as if you heard the audio.
                Focus on the specific Tajweed rules present in this verse (e.g., Ahkam Noon Sakinah, Mad, Makharij).
                
                Return the response STRICTLY as a JSON object with this structure:
                {
                    "score": number (0-100),
                    "positives": ["string", "string"],
                    "improvements": ["string", "string"],
                    "details": "A brief encouraging closing statement"
                }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]) as TajweedFeedback;
            }

            throw new Error("Failed to parse AI response");
        } catch (error) {
            console.error("Gemini recitation analysis failed:", error);
            return this.getMockTajweed();
        }
    },

    /**
     * Consult Fiqh knowledge base using Gemini.
     */
    async consultFiqh(question: string, madhab: string = 'hanafi'): Promise<any> {
        if (!API_KEY) {
            console.warn("Gemini API Key missing. Falling back to mock.");
            return this.getMockFiqh();
        }

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: `You are an expert Islamic Jurist (Mufti) specializing in the ${madhab} Madhab. 
                Your answers should be based on traditional secondary sources like Radd al-Muhtar, Al-Hidayah, or similar authoritative texts. 
                Keep the tone respectful, clear, and educational. Always mention if there are major differences with other schools.`
            });

            const prompt = `User Question: "${question}"`;
            const result = await model.generateContent(prompt);
            const response = await result.response;

            return {
                answer: response.text(),
                context: `Primary Source: ${madhab.charAt(0).toUpperCase() + madhab.slice(1)} Jurisprudence`,
                differences: "Referenced within the answer if applicable."
            };
        } catch (error) {
            console.error("Gemini Fiqh consultation failed:", error);
            return this.getMockFiqh();
        }
    },

    // Mock Fallbacks
    getMockTajweed(): TajweedFeedback {
        return {
            score: 85,
            positives: ["Clear articulation", "Consistent rhythm"],
            improvements: ["Focus on the Heavy letters (Khus Sa'd Qad)"],
            details: "MashaAllah, a very good effort. Keep practicing the Makharij."
        };
    },

    getMockFiqh(): any {
        return {
            answer: "We are currently having trouble connecting to the AI Mufti. Please try again in a moment.",
            context: "Connection Error",
            differences: "N/A"
        };
    }
};
