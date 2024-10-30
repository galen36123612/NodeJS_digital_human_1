// import { AssistantResponse } from 'ai';
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  try {
    const result = await streamText({
      model: openai("gpt-4-turbo"),
      messages,
    });

    return result.toAIStreamResponse();
  } catch (err) {
    console.log(err);
  }
}
