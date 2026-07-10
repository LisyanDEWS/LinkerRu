import { readFile } from "node:fs/promises";
import { join } from "node:path";

// The LinkerRu interface is a self-contained static HTML document
// (see public/index.html). Until the planned Next.js component refactor
// lands, serve that document verbatim at the site root so the existing
// app keeps working while giving Next.js a valid App Router entry point.
export const dynamic = "force-static";

export async function GET() {
  const html = await readFile(
    join(process.cwd(), "public", "index.html"),
    "utf8",
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
