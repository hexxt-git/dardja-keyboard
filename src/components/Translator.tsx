"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { useTranslate } from "@/lib/useTranslate";

export function Translator() {
  const [inputText, setInputText] = useState("");
  const { translate, translatedText, isLoading, error } = useTranslate();

  useEffect(() => {
    if (inputText.trim() === "") {
      return;
    }

    const debounceId = setTimeout(() => {
      translate(inputText);
    }, 1000);

    return () => {
      clearTimeout(debounceId);
    };
  }, [inputText, translate]);

  return (
    <div className="mt-8 mx-auto w-full max-w-2xl text-left flex flex-col gap-4">
      <Textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="adkhel kitabat arabizi hna"
        rows={4}
      />

      <div className="relative">
        <Textarea
          value={translatedText}
          readOnly
          placeholder="ستظهر ترجمتك هنا..."
          dir="rtl"
          rows={4}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Spinner size="md" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <p className="text-red-500">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
