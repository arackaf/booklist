import { json } from "@sveltejs/kit";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  await wait(150);

  return json(
    { value: Math.random() },
    {
      headers: {
        "Cache-Control": "max-age=15"
      }
    }
  );
}
