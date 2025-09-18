"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { translateAction } from "@/actions/translate";

export function Translator() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  useEffect(() => {
    if (inputText.trim() === "") {
      setOutputText("");
      return;
    }

    const controller = new AbortController();
    const debounceId = setTimeout(async () => {
      try {
        const result = await translateAction(inputText);
        setOutputText(result.text);
      } catch (err) {
        setOutputText("Error");
      }
    }, 1000);

    return () => {
      controller.abort();
      clearTimeout(debounceId);
    };
  }, [inputText]);

  return (
    <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4">
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="adkhel kitabat arabizi hna"
        rows={4}
      />

      <Textarea
        value={outputText}
        readOnly
        placeholder="ستظهر ترجمتك هنا..."
        dir="rtl"
        rows={4}
      />
    </div>
  );
}
