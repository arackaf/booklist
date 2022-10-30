import { Session } from "next-auth";
import { headers } from "next/headers";

export async function getSession(): Promise<Session> {
  const cookie = headers().get("cookie");
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
    headers: { cookie }
  });

  if (!response?.ok) {
    return null;
  }

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}
