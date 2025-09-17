import { serve } from "bun";
import index from "./index.html";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import Prompt from "./prompt.txt";
import { z } from "zod";

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

const server = serve({
  routes: {
    "/api/translate": {
      async POST(req) {
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
      },
    },

    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
