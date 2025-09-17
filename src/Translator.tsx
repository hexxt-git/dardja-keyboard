import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Textarea } from "./components/ui/textarea";

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
        const res = await fetch("/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          setOutputText(text || "Error");
          return;
        }

        const data: { text?: string } = await res.json();
        setOutputText(data.text ?? "");
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          setOutputText("Error");
        }
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
        placeholder="Type here..."
      />

      <Textarea
        value={outputText}
        readOnly
        placeholder="ستظهر ترجمتك هنا..."
        dir="rtl"
      />
    </div>
  );
}
