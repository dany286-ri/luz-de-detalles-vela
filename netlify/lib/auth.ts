import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // la sesión del panel dura 12 horas

type Env = Record<string, string | undefined>;

function sha(input: string): Buffer {
  return createHash("sha256").update(input).digest();
}

/** El panel solo funciona si Dany definió la variable ADMIN_PASSWORD en Netlify. */
export function adminConfigured(env: Env): boolean {
  return !!env.ADMIN_PASSWORD && env.ADMIN_PASSWORD.length >= 8;
}

export function checkPassword(input: string, env: Env): boolean {
  if (!adminConfigured(env)) return false;
  // Se comparan los hashes en tiempo constante para no filtrar información.
  return timingSafeEqual(sha(input), sha(env.ADMIN_PASSWORD as string));
}

function sign(exp: string, env: Env): string {
  const key = sha(`luz-admin|${env.ADMIN_PASSWORD}`);
  return createHmac("sha256", key).update(exp).digest("hex");
}

export function signToken(env: Env, now = Date.now()): string {
  const exp = String(now + TOKEN_TTL_MS);
  return `${exp}.${sign(exp, env)}`;
}

export function verifyToken(token: string | null | undefined, env: Env, now = Date.now()): boolean {
  if (!token || !adminConfigured(env)) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || !/^[0-9a-f]{64}$/.test(sig) || Number(exp) < now) return false;
  const expected = Buffer.from(sign(exp, env), "hex");
  const given = Buffer.from(sig, "hex");
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function bearerToken(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}
