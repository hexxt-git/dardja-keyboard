"use client";

import { translateAction } from "@/actions/translate";
import { useMutation } from "@tanstack/react-query";

export function useTranslate() {
  const {
    mutate: translate,
    data,
    isPending,
    error,
    reset,
  } = useMutation({
    mutationFn: async (text: string) => {
      if (text.trim() === "") {
        return { text: "" };
      }
      return await translateAction(text);
    },
  });

  return {
    translate,
    translatedText: data?.text || "",
    isLoading: isPending,
    error,
    reset,
  };
}
