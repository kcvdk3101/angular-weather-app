import { hashPassword, verifyPassword } from './password.util';

describe('password.util', () => {
  it('hash & verify success', async () => {
    const h = await hashPassword('secret123');
    expect(h).toContain(':');
    const ok = await verifyPassword('secret123', h);
    expect(ok).toBeTrue();
  });

  it('verify fail with wrong password', async () => {
    const h = await hashPassword('abc');
    const ok = await verifyPassword('xyz', h);
    expect(ok).toBeFalse();
  });
});