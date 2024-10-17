import { json } from "@sveltejs/kit";

export async function GET({ url, setHeaders, locals }) {
  process.exit(1);
  return json({});
}
