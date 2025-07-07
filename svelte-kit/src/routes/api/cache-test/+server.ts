import { json } from "@sveltejs/kit";

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let i = 0;
export async function GET() {
  await wait(150);

  console.log("cache-test", i++);

  return json(
    { value: Math.random() },
    {
      headers: {
        "Cache-Control": "max-age=15, private"
      }
    }
  );
}
