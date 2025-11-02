import { environment } from '../../environments/environment';
import { AuthTokenPayload } from '../models/user.model';

// Base64URL helpers
function base64UrlEncode(data: ArrayBuffer | string): string {
  let str = typeof data === 'string'
    ? btoa(data)
    : btoa(String.fromCharCode(...new Uint8Array(data)));
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = str.length % 4;
  if (pad) str += '='.repeat(4 - pad);
  return atob(str);
}

async function hmacSHA256(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return base64UrlEncode(signature);
}

export async function signJwt(username: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + environment.auth.accessTokenTtlSeconds;
  const header = { alg: 'HS256', typ: 'JWT' };
  const payload: AuthTokenPayload = { sub: username, iat: now, exp };
  const headerStr = base64UrlEncode(JSON.stringify(header));
  const payloadStr = base64UrlEncode(JSON.stringify(payload));
  const unsigned = `${headerStr}.${payloadStr}`;
  const signature = await hmacSHA256(unsigned, environment.auth.jwtSecret);
  return `${unsigned}.${signature}`;
}

export async function verifyJwt(token: string): Promise<AuthTokenPayload | null> {
  try {
    const [headerStr, payloadStr, sig] = token.split('.');
    if (!headerStr || !payloadStr || !sig) return null;
    const unsigned = `${headerStr}.${payloadStr}`;
    const expectedSig = await hmacSHA256(unsigned, environment.auth.jwtSecret);
    if (expectedSig !== sig) return null;
    const json = base64UrlDecode(payloadStr);
    const payload: AuthTokenPayload = JSON.parse(json);
    return payload;
  } catch {
    return null;
  }
}

export function isExpired(payload: AuthTokenPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now >= payload.exp;
}

export function isWithinGrace(payload: AuthTokenPayload): boolean {
  const now = Math.floor(Date.now() / 1000);
  return now < payload.exp + environment.auth.refreshGraceSeconds;
}