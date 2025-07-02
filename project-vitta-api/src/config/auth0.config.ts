import { config as dotenvConfig } from 'dotenv';
import { ConfigParams } from 'express-openid-connect';

dotenvConfig({ path: '.env.development' });

export const config: ConfigParams = {
  authRequired: false, // solo algunas rutas requerirán auth
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,

  routes: {
    login: false,
    logout: false,
    callback: '/auth/callback',
  },
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email',
    audience: process.env.AUTH0_AUDIENCE,
  },
};
