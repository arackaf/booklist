import { auth, getProviderId, initializeAuth } from "$lib/auth"; // path to your auth file
import { svelteKitHandler } from "better-auth/svelte-kit";

import { env } from "$env/dynamic/private";
import { building } from "$app/environment";

const { BOOKLIST_DYNAMO, AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, DYNAMO_AUTH_TABLE } = env;

import { initializePostgres } from "$data/dbUtils";

initializePostgres({
  useMockDb: building,
  connectionString: env.PSCALE_URL
});
initializeAuth();

export async function handle({ event, resolve }: any) {
  if (event.url.pathname.includes("/.well-known/appspecific/com.chrome.devtools")) {
    return new Response(null, { status: 204 }); // Return empty response with 204 No Content
  }

  const sessionPayload = await auth.api.getSession({
    headers: event.request.headers
  });

  if (sessionPayload && sessionPayload.session) {
    const providerId = await getProviderId(sessionPayload.session.userId);
    (sessionPayload as any).userId = providerId;
    sessionPayload.session.userId = providerId;
  }
  event.locals.getSession = () => sessionPayload;

  return svelteKitHandler({ event, resolve, auth, building });
}
