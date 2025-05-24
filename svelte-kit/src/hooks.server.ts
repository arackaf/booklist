import { sequence } from "@sveltejs/kit/hooks";

const PRELOAD = new Set(["font", "js", "css"]);

async function handleFn({ event, resolve }: any) {
  const response = await resolve(event, {
    preload: ({ type }: any) => PRELOAD.has(type)
  });

  return response;
}

export const handle = sequence(handleFn);
