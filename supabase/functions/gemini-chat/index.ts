import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, payload } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log(`Processing ${type} request`);

    let response;
    switch (type) {
      case "chat":
        response = await handleChat(payload, LOVABLE_API_KEY);
        break;
      case "pathway":
        response = await handlePathway(payload, LOVABLE_API_KEY);
        break;
      case "clarity":
        response = await handleClarity(payload, LOVABLE_API_KEY);
        break;
      case "wellness":
        response = await handleWellness(payload, LOVABLE_API_KEY);
        break;
      case "summarize":
        response = await handleSummarize(payload, LOVABLE_API_KEY);
        break;
      default:
        throw new Error(`Unknown request type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true, data: response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error:", error);

    let status = 500;
    let message = "Internal server error";

    if (error.message?.includes("429")) {
      status = 429;
      message = "We're experiencing high demand. Please try again in a minute.";
    } else if (error.message?.includes("401")) {
      status = 401;
      message = "Authentication error. Please contact support.";
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: { code: status, message, details: error.message },
      }),
      {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function handleChat(payload: any, apiKey: string) {
  const { messages, crisisDetected, crisisSeverity } = payload;

  // Build system prompt based on crisis detection
  let systemPrompt = SAHAY_SYSTEM_PROMPT;
  if (crisisDetected && (crisisSeverity === "high" || crisisSeverity === "moderate")) {
    systemPrompt = SAHAY_SYSTEM_PROMPT + CRISIS_ENHANCED_PROMPT;
    console.log("Crisis detected - using enhanced safety prompt");
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI API error:", response.status, errorText);
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "I'm having trouble responding right now. Please try again.";

  return { reply, crisisDetected, crisisSeverity };
}

async function handlePathway(payload: any, apiKey: string) {
  const { goal, days = 5, intensity = "medium" } = payload;

  const prompt = `Create a ${days}-day wellness pathway for: "${goal}"

Intensity level: ${intensity}

Return ONLY valid JSON (no markdown) in this exact format:
{
  "pathway": [
    {
      "title": "Day title",
      "actions": ["action 1", "action 2", "action 3"]
    }
  ]
}

Make it practical, culturally relevant for Indian students, and progressive across days.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a wellness pathway generator. Always return valid JSON only." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  
  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    // Fallback if JSON parsing fails
    return {
      pathway: [
        { title: "Understanding Your Goal", actions: ["Reflect on why this matters to you", "Set a clear intention", "Share with a trusted friend"] },
        { title: "Building Foundation", actions: ["Try one small action today", "Notice how you feel", "Track your progress"] },
        { title: "Developing Momentum", actions: ["Increase practice time", "Connect with supportive people", "Celebrate small wins"] },
        { title: "Overcoming Challenges", actions: ["Identify obstacles", "Problem-solve with compassion", "Adjust your approach"] },
        { title: "Sustaining Progress", actions: ["Review what worked", "Plan for maintenance", "Set new goals"] },
      ],
    };
  }
}

async function handleClarity(payload: any, apiKey: string) {
  const { careerPrompt, experienceLevel = "student" } = payload;

  const prompt = `Career guidance request from ${experienceLevel}:
"${careerPrompt}"

Provide 2-3 different perspectives/paths with reframes and actionable steps.

Return ONLY valid JSON (no markdown) in this exact format:
{
  "roadmap": [
    {
      "path": "Path name",
      "reframe": "A different way to think about this situation",
      "actions": ["specific step 1", "specific step 2", "specific step 3"]
    }
  ]
}

Make it practical, culturally aware for Indian students, and non-judgmental.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a career clarity advisor. Always return valid JSON only." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  
  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    // Fallback if JSON parsing fails
    return {
      roadmap: [
        {
          path: "Path A: Structured Exploration",
          reframe: "This isn't about choosing the 'right' path—it's about exploring what energizes you.",
          actions: [
            "List your top 3 interests and research each for 30 minutes",
            "Connect with 2-3 professionals in those fields via LinkedIn",
            "Try a small project or internship in your top choice",
          ],
        },
        {
          path: "Path B: Skills-First Approach",
          reframe: "Focus on building transferable skills rather than committing to one career.",
          actions: [
            "Identify 3 key skills you enjoy developing",
            "Find opportunities to practice these (projects, volunteering)",
            "Talk to SAHAY about managing family expectations",
          ],
        },
      ],
    };
  }
}

async function handleWellness(payload: any, apiKey: string) {
  // This would analyze calendar events - simplified for now
  return {
    nudges: [
      {
        type: "info",
        message: "Calendar analysis feature coming soon! For now, try the AI Companion or Pathways.",
      },
    ],
  };
}

async function handleSummarize(payload: any, apiKey: string) {
  const { messages } = payload;
  
  const conversationText = messages
    .map((m: any) => `${m.role}: ${m.content}`)
    .join('\n\n');

  const prompt = `Analyze this conversation and provide a thoughtful summary:

${conversationText}

Return ONLY valid JSON (no markdown) in this exact format:
{
  "reflection": "A 2-3 sentence empathetic reflection on the conversation themes and emotional journey",
  "actionItems": ["specific actionable step 1", "specific actionable step 2", "specific actionable step 3"]
}

Make it personal, supportive, and culturally aware for Indian students.`;

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "You are a wellness conversation summarizer. Always return valid JSON only." },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  
  try {
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    // Fallback if JSON parsing fails
    return {
      reflection: "We explored some important feelings and challenges together. Remember, it's okay to take things one step at a time.",
      actionItems: [
        "Take 5 minutes today for a grounding exercise",
        "Check in with yourself about how you're feeling",
        "Consider starting a Pathway if something resonated with you"
      ]
    };
  }
}
