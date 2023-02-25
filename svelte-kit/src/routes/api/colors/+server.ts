import { json } from "@sveltejs/kit";

import { labelColors } from "$data/labelColors";

export async function GET({ setHeaders }: { setHeaders: any }) {
  setHeaders({
    "cache-control": "max-age=86400"
  });

  return json(labelColors);
}
