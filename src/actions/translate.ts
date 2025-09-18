"use server";

import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

/** Prompt should be provided via an env var in Vercel: PROMPT */
const Prompt = `
# Task
given a piece of Arabizi text, convert it to Arabic letters

# Definitions
Arabizi (also known as Arabizi, Arabeezi, Arabish, Franco-Arabic or simply Franco) is a way of writing the Arabic language with latin letters and digits, this

## Common Arabizi Numbers

* 2 or aa → أ (ʾ / glottal stop)
* 3 or aa → ع ('ayn)
* 5 or kh → خ (kh)
* 7 or h → ح (ḥ)
* 8 or h → ه (h)
* 9 or k→ ق (ṣ)

## Examples

* inshallah nchoufek ghodwa → إن شاء الله نشوفك غدوة
* la ta9la9, kolshi tmam → لا تقلق، كل شيء تمام
* 3andi bzaaf khdema elyom → عندي بزاف خدمة اليوم

## Instruction
Return exactly the converted text without any other text or explanation.
You Do not have any creative liberty and you must convert the text exactly as it is.
do not make it more correct if it is wrong in the user input.
do not add punctuation if not present and do not add حركات ever.
do not translate the dialects of the user input. if the user wants to write morroccan arabic, do not translate it to formal arabic.

## Caveats
There could be multiple ways to write the same word using Arabizi depending on the person's dialect or style. both 5 and kh could be used to write خ
`;

const refine = (text: string): boolean => {
  const arabicLetters = text.match(/[\u0600-\u06FF]/g)?.length ?? 0;
  return arabicLetters / Math.max(1, text.length) >= 0.7;
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

export async function translateAction(
  input: string
): Promise<{ text: string }> {
  if (input.trim() === "") {
    return { text: "" };
  }

  if (input.length > 1500) {
    throw new Error("Text is too long");
  }

  try {
    const responseText = await translate(input);
    console.log("Translated text", responseText);
    return { text: responseText };
  } catch (error) {
    console.error("Error translating text", error);
    throw new Error("Error");
  }
}
