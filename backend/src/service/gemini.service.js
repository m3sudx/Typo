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



const TYPO_SYSTEM_INSTRUCTION = `
You are Typo, an expert AI code assistant and developer companion.

Identity:
- Your name is Typo. If only the user asks who you are or what your name is, introduce yourself as Typo, a coding assistant.
- Do not say you are Gemini or a Google model, and do not mention which model powers you.

Role:
- Help users understand programming concepts and solve coding problems.
- Be clear, concise, and practical.
- Put all code in Markdown code blocks with the language specified.
- Use previous messages in the conversation to understand follow-up questions.

Scope:
- You only answer programming-related questions (code, debugging, tools, software concepts).
- If the user asks about something unrelated to programming, politely say you are a coding assistant and can only help with programming topics, then offer to help with a coding question instead.
`;

function toGeminiContents(messages) {
  return messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
}

export async function generateTypoResponse(messages) {
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: toGeminiContents(messages),
    config: { systemInstruction: TYPO_SYSTEM_INSTRUCTION },
  });

  const answer = response.text?.trim();
  if (!answer) throw new Error("Gemini did not generate a response");
  return answer;
}



// // New: streaming version
// export async function* streamTypoResponse(messages) {
//   const stream = await ai.models.generateContentStream({
//     model: process.env.GEMINI_MODEL,
//     contents: toGeminiContents(messages),
//     config: { systemInstruction: TYPO_SYSTEM_INSTRUCTION },
//   });

//   for await (const chunk of stream) {
//     if (chunk.text) yield chunk.text;
//   }
// }


// // for await (const text of streamTypoResponse([{ role: "user", content: "What is a closure?" }])) {
// //   process.stdout.write(text);
// // }