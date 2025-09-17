export const runtime = "edge";

export default async function handler(req: Request): Promise<Response> {
  return Response.json({ ok: true, time: Date.now() });
}
