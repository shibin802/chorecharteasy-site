import { createRemoteJWKSet, jwtVerify } from 'jose';

const keys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export async function verifyGoogleCredential(credential, clientId, nonce, keySet = keys) {
  const { payload } = await jwtVerify(credential, keySet, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: clientId,
    algorithms: ['RS256'],
    requiredClaims: ['sub', 'exp', 'iat', 'nonce', 'email'],
    maxTokenAge: '10 minutes',
  });
  if (payload.nonce !== nonce || payload.email_verified !== true || typeof payload.sub !== 'string') {
    throw new Error('Invalid Google identity');
  }
  return { subject: payload.sub, email: payload.email };
}
