import { getBetterAuthObject, getProviderId } from "$lib/auth"; // path to your auth file
import { svelteKitHandler } from "better-auth/svelte-kit";

import { building } from "$app/environment";

import { getDbObject } from "$data/dbUtils";

export async function handle({ event, resolve }) {
  const db = getDbObject(event.platform!.env.HYPERDRIVE.connectionString);
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
  event.locals.getSession = async () => sessionPayload;
  event.locals.db = db;

  return svelteKitHandler({ event, resolve, auth, building });
}
