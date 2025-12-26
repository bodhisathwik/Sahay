// SAHAY System Prompt
const SAHAY_SYSTEM_PROMPT = `You are SAHAY — a culturally-aware wellness companion for Indian university students. 

Core Traits:
- Speak with an empathetic, encouraging, and non-judgmental tone
- Understand Hinglish and common Indian student slang naturally
- Offer practical wellness strategies (mindfulness, grounding, pranayama, CBT techniques)
- Provide culturally-relevant examples (exam stress, parental expectations, hostel life, career pressure)
- You are NOT a medical professional — acknowledge this when appropriate
- Keep responses concise but warm (2-4 paragraphs max unless explaining techniques)

CRITICAL SAFETY PROTOCOL:
If a user mentions self-harm, suicide, harm to others, or severe mental health deterioration:
1. Acknowledge their feelings with deep empathy: "I hear you, and what you're feeling matters deeply."
2. Ask gently about immediate safety: "Are you safe right now?"
3. ALWAYS provide crisis resources:
   - AASRA: +91-9152987821 (24/7 suicide prevention helpline)
   - iCall: +91-9152987821 (psychosocial counseling)
   - Emergency Services: 112
4. Encourage reaching out: "Would you consider calling AASRA or talking to someone you trust?"
5. Do NOT provide harmful instructions under any circumstances
6. Stay present and supportive

INTENTS TO RECOGNIZE:
- STRESS: Academic pressure, work stress, daily life overwhelm
- ANXIETY: Worry, panic, nervousness, physical symptoms
- EXAM_PRESSURE: Test anxiety, board exams, competitive exams, fear of failure
- BURNOUT: Exhaustion, lack of motivation, feeling depleted
- LONELINESS: Social isolation, homesickness, feeling disconnected
- CAREER_CONFUSION: Uncertainty about future, parental expectations about career
- CRISIS: Self-harm, suicidal ideation, severe distress (TRIGGER SAFETY PROTOCOL)

Communication Style:
- Use "yaar", "bhai/behen" naturally when appropriate
- Validate emotions: "It's totally valid to feel overwhelmed"
- Offer immediate practical actions (4-4-4 breathing, grounding exercises)
- End responses with an invitation to continue or try an exercise`;

const CRISIS_ENHANCED_PROMPT = `
IMPORTANT: The user may be experiencing a mental health crisis. 
Respond with extra care, empathy, and ALWAYS include crisis resources.
Prioritize their safety above all else. Be direct but gentle about getting help.
`;

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const runGeminiChat = async (body: any) => {
    try {
        const { type, payload } = body;
        console.log("Gemini: Initializing with Key:", import.meta.env.VITE_GEMINI_API_KEY ? "Present" : "Missing");
        console.log("Gemini: Model Name:", "gemini-2.5-flash");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        if (type === "chat") {
            const { messages, crisisDetected, crisisSeverity } = payload;

            // Build system prompt based on crisis detection
            let systemPrompt = SAHAY_SYSTEM_PROMPT;
            if (crisisDetected && (crisisSeverity === "high" || crisisSeverity === "moderate")) {
                systemPrompt = SAHAY_SYSTEM_PROMPT + CRISIS_ENHANCED_PROMPT;
            }

            // Convert messages to Gemini format
            // Gemini requires history to start with user and alternate
            let cleanHistory = messages.slice(0, -1);

            // If the first message is from assistant, remove it
            if (cleanHistory.length > 0 && cleanHistory[0].role === "assistant") {
                cleanHistory = cleanHistory.slice(1);
            }

            // Add system prompt as first message in history
            const history = [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }]
                },
                {
                    role: "model",
                    parts: [{ text: "I understand. I'm SAHAY, your wellness companion. How can I help you today?" }]
                },
                ...cleanHistory.map((msg: any) => ({
                    role: msg.role === "assistant" ? "model" : "user",
                    parts: [{ text: msg.content }],
                }))
            ];

            const lastMessage = messages[messages.length - 1].content;

            const chat = model.startChat({
                history: history,
            });
            console.log("Gemini: Chat History:", JSON.stringify(history, null, 2));

            const result = await chat.sendMessage(lastMessage);
            const response = await result.response;
            const text = response.text();

            return {
                success: true,
                data: {
                    reply: text,
                    crisisDetected,
                    crisisSeverity
                }
            };
        }

        else if (type === "pathway") {
            const { goal, days } = payload;
            const prompt = `${SAHAY_SYSTEM_PROMPT}\n\nCreate a ${days}-day wellness pathway for a student with the goal: "${goal}". 
      Return ONLY a JSON array where each object has: "title" (string), and "actions" (array of strings). 
      Make it actionable and specific for Indian students.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            // Clean up json markdown if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return { success: true, data: { pathway: JSON.parse(jsonStr) } };
        }

        else if (type === "clarity") {
            const { careerPrompt } = payload;
            const prompt = `${SAHAY_SYSTEM_PROMPT}\n\nAct as a career counselor. For this student query: "${careerPrompt}", 
      generate 3 distinct roadmap paths. Return ONLY a JSON object with a key "roadmap" containing an array of 3 objects.
      Each object must have: "path" (title), "reframe" (perspective shift), and "actions" (3 steps).
      Keep it encouraging and practical.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return { success: true, data: JSON.parse(jsonStr) };
        }

        else if (type === "summarize") {
            const { messages } = payload;
            const conversation = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');
            const prompt = `${SAHAY_SYSTEM_PROMPT}\n\nSummarize this wellness conversation. Return a JSON object with "reflection" (insight) and "actionItems" (array of strings). Conversation:\n${conversation}`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return { success: true, data: JSON.parse(jsonStr) };
        }

        else if (type === "analyze_schedule") {
            const { events } = payload;
            const prompt = `${SAHAY_SYSTEM_PROMPT}\n\nAnalyze this student's calendar events for the next few days: ${JSON.stringify(events)}.
            Look for patterns of burnout (too many back-to-back events), overload (exam/deadline clustering), or balance (good sleep/breaks).
            Return ONLY a JSON array of "Nudge" objects. Each object must have:
            - "type": "burnout" | "overload" | "balance"
            - "title": (string)
            - "description": (string, specific to their schedule)
            - "emoji": (string)
            - "actions": (array of 3 distinct string actions)
            
            Return at least 2-3 insights. If schedule is empty, provide general study advice.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

            return { success: true, data: { nudges: JSON.parse(jsonStr) } };
        }

        throw new Error("Invalid behavior type");

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return { success: false, error: error.message };
    }
};
