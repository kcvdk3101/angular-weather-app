import { signJwt, verifyJwt, isExpired, isWithinGrace } from './jwt.util';
import { environment } from '../../environments/environment';

describe('jwt.util', () => {
  it('signs and verifies a token', async () => {
    const token = await signJwt('alice');
    const payload = await verifyJwt(token);
    expect(payload).toBeTruthy();
    expect(payload!.sub).toBe('alice');
    expect(isExpired(payload!)).toBeFalse();
  });

  it('isWithinGrace behaves correctly after expiry', async () => {
    const token = await signJwt('bob');
    const payload = await verifyJwt(token);
    expect(payload).toBeTruthy();

    (payload as any).exp = Math.floor(Date.now() / 1000) - 10;
    const grace = isWithinGrace(payload!);
    expect(grace).toBeTrue();
  });
});