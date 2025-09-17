import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import fs from "fs";
import path from "path";

// Read the prompt file
const promptPath = path.join(process.cwd(), "src", "prompt.txt");
const Prompt = fs.readFileSync(promptPath, "utf-8");

/**
 * Ensure 70% of the text is Arabic letters
 * @param text the text to refine
 * @returns
 */
const refine = (text: string): boolean => {
  const arabicLetters = text.match(/[\u0600-\u06FF]/g)?.length ?? 0;
  return arabicLetters / text.length >= 0.7;
};

const translate = async (input: string): Promise<string> => {
  const response = await generateObject({
    schema: z.object({
      text: z.string().refine((text) => text.length > 0 && refine(text)),
    }),
    model: groq("openai/gpt-oss-20b"),
    system: Prompt,
    prompt: input,
  });
  return response.object.text;
};

export const runtime = "edge"; // This is required for Edge Functions
export default async function handler(req: Request, res: Response) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const input = String(body?.text ?? "");

    if (input.trim() === "") {
      return Response.json({ text: "" });
    }

    if (input.length > 1500) {
      return new Response("Text is too long", { status: 400 });
    }

    const response = await translate(input);
    return Response.json({ text: response });
  } catch (error) {
    console.error("Error translating text", error);
    return new Response("Error", { status: 500 });
  }
}
