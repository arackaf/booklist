import { getBetterAuthObject, getProviderId } from "$lib/auth"; // path to your auth file
import { svelteKitHandler } from "better-auth/svelte-kit";

import { env } from "$env/dynamic/private";
import { building } from "$app/environment";

import { initializePostgres, getDbObject } from "$data/dbUtils";

initializePostgres({
  useMockDb: building,
  connectionString: env.PSCALE_URL
});

export async function handle({ event, resolve }: any) {
  const db = getDbObject(env.PSCALE_URL);
  const auth = getBetterAuthObject(db);

  if (event.url.pathname.includes("/.well-known/appspecific/com.chrome.devtools")) {
    return new Response(null, { status: 204 }); // Return empty response with 204 No Content
  }

  const sessionPayload = await auth.api.getSession({
    headers: event.request.headers
  });

  if (sessionPayload && sessionPayload.session) {
    const providerId = await getProviderId(db, sessionPayload.session.userId);
    (sessionPayload as any).userId = providerId;
    sessionPayload.session.userId = providerId;
  }
  event.locals.getSession = () => sessionPayload;
  event.locals.db = db;

  return svelteKitHandler({ event, resolve, auth, building });
}
