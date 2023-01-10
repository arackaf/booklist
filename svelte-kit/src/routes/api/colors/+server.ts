import { json } from "@sveltejs/kit";

import { allLabelColors } from "$data/labelColors";

export async function GET({ setHeaders }: { setHeaders: any }) {
  setHeaders({
    "cache-control": "max-age=86400"
  });

  const colors = await allLabelColors();

  return json(colors);
}
