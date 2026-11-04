import { cookies } from "next/headers";
import { verifySessionCookie } from "./firebase-admin";

const SESSION_COOKIE = "lumen_session";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;
  try {
    const decoded = await verifySessionCookie(session);
    return { id: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
