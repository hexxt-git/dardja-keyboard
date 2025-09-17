"use server";

export async function helloAction(): Promise<{ ok: boolean; time: number }> {
  return { ok: true, time: Date.now() };
}
