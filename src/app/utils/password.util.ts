export async function hashPassword(raw: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const salted = new Uint8Array([...salt, ...enc.encode(raw)]);
  const digest = await crypto.subtle.digest('SHA-256', salted);
  const hashHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(raw: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(h => parseInt(h, 16)));
  const enc = new TextEncoder();
  const salted = new Uint8Array([...salt, ...enc.encode(raw)]);
  const digest = await crypto.subtle.digest('SHA-256', salted);
  const compHex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  return compHex === hashHex;
}