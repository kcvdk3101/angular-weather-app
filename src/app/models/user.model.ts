export interface AppUser {
  username: string;
  passwordHash: string;
  createdAt: number;
}

export interface AuthTokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface AuthTokenData {
  token: string;
  payload: AuthTokenPayload;
}