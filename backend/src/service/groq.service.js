import OpenAI from "openai";

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function generateConversationTitle(firstMessage) {
  const cleanMessage = (firstMessage || "").trim();

  if (cleanMessage.length < 5) {
    return "New Conversation";
  }

  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content: "Generate a short title (3-6 words) for this conversation. Reply with only the title.",
        },
        {
          role: "user",
          content: cleanMessage.slice(0, 800),
        },
      ],
      temperature: 0.4,
      max_tokens: 20,
    });

    let title = response.choices?.[0]?.message?.content?.trim() || "";

    // Clean the response
    title = title
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/^(Title|Conversation Title):\s*/i, "")
      .replace(/[.!?]+$/, "")
      .trim();

    if (!title || title.length < 3) {
      // Smart fallback from the first message
      const fallback = cleanMessage
        .split(/\s+/)
        .slice(0, 5)
        .join(" ")
        .replace(/[^\w\s]/g, "");

      return fallback.length > 3 ? fallback : "New Conversation";
    }

    return title.length > 50 ? title.slice(0, 47) + "..." : title;
  } catch (error) {
    console.error("Title generation error:", error.message);
    return "New Conversation";
  }
}