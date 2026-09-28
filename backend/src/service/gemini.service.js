import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function generateConversationTitle(firstMessage) {
  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL,
      contents: `
Create a short title for this conversation.
Use 3 to 6 words.
Return only the title without quotation marks.

First message:
${firstMessage}
`,
    });

    const title = response.text?.trim();

    if (!title) {
      throw new Error("Gemini did not generate a conversation title");
    }

    return title.replace(/^["']|["']$/g, "");
  } catch (error) {
    console.error("Failed to generate AI title, using default fallback:", error.message);
    // Fallback title derived directly from the user's input string
    return firstMessage.slice(0, 30) + "...";
  }
} 



export async function generateTypoResponse(messages) {
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));

  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents,
    systemInstruction: `
You are Typo, an expert AI code assistant and developer companion.

Help users understand programming concepts and solve coding problems.
Be clear, concise, and practical.
Use Markdown code blocks for code.
Use previous messages to understand follow-up questions.
`,
  });

  const answer = response.text?.trim();

  if (!answer) {
    throw new Error("Gemini did not generate a response");
  }

  return answer;
}