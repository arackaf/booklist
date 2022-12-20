const PRELOAD = new Set(["font", "js", "css"]);

export async function handle({ event, resolve }: any) {
  const response = await resolve(event, {
    preload: ({ type }: any) => PRELOAD.has(type)
  });

  return response;
}
