import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(config());

const env = (key: string, defaultValue: any = undefined) => {
  return process.env[key] || defaultValue;
};

env.require = (key: string, defaultValue: any = undefined) => {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value;
};

const appConfig = {
  admin: {
    accessKey: env('ACCESS_KEY_ADMIN'),
  },
  app: {
    name: 'onculture',
    baseUrl: env('BASE_URL'),
    clientUrl: env('CLIENT_URL'),
    port: parseInt(env('PORT', '4000')),
    hostname: env('HOST_NAME', 'localhost'),
    host: env(
      'HOST',
      `http://${env('HOST_NAME', 'localhost')}:${parseInt(
        env('PORT', '4000'),
      )}`,
    ),
    timezone: env('TZ', 'Africa/Lagos'),
  },
  cloudinary: {
    name: env('CLOUDINARY_NAME'),
    apiKey: env('CLOUDINARY_API_KEY'),
    apiSecret: env('CLOUDINARY_API_SECRET'),
  },
  crypto: {
    secret: env('CRYPTO_SECRET'),
    key: env('PASSPHRASE'),
  },
  db: {
    url:
      env('NODE_ENV') === 'production'
        ? env.require('MONGODB_URI_PROD')
        : env.require('MONGODB_URI_DEV'),
    name: env.require('DB_NAME'),
    port: env('DB_PORT'),
  },
  environment: env.require('NODE_ENV', 'development'),
  google: {
    clientId: env('CLIENT_ID'),
    clientSecret: env('CLIENT_SECRET'),
    callbackURL: env(
      'CALLBACK_URL',
      `http://${env('HOST_NAME', 'localhost')}:${parseInt(
        env('PORT', '4000'),
      )}/users/google/callback`,
    ),
  },
  jwt: {
    secret: env.require('JWT_SECRET', 'icannotthinkofasecretreally'),
    expiry: parseInt(env('JWT_EXPIRATION_TIME', 3600)),
  },
  messaging: {
    mail: {
      host: env('MAILER_HOST'),
      port: parseInt(env('MAILER_PORT', '465')),
      user: env('MAILER_EMAIL'),
      password: env('MAILER_PASS'),
      mailerlite: {
        id: env('MAILERLITE_GROUP_ID'),
        key: env('MAILER_LITE_KEY'),
      },
    },
    sms: {},
  },
  mixPanel: {
    token: env('MIX_PANEL_TOKEN'),
  },
  redis: {
    host: env.require('REDIS_CONTAINER_NAME'),
    port: parseInt(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD'),
    ttl: env('REDIS_TTL'),
  },
  sanity: {
    apiVersion: env('SANITY_API_VERSION', '2021-03-25'),
    token: env('SANITY_TOKEN'),
    projectId: env('SANITY_PROJECT_ID'),
    dataset: env('SANITY_DATASET'),
  },
  slack: {
    app: {
      id: env('SLACK_APP_ID'),
    },
    client: {
      id: env('SLACK_CLIENT_ID'),
      secret: env('SLACK_CLIENT_SECRET'),
      scope: env('SLACK_CLIENT_SCOPE'),
    },
    callback: env('SLACK_AUTH_URI_CALLBACK'),
    secret: env('SLACK_SIGNING_SECRET'),
    token: {
      app: env('SLACK_APP_TOKEN'),
      bot: env('SLACK_BOT_TOKEN'),
    },
    user: {
      scope: env('SLACK_USER_SCOPE'),
    },
  },
  swagger: {
    user: {
      [env('SWAGGER_USER_NAME', 'onculture-admin')]: env(
        'SWAGGER_USER_PASSWORD',
        'password',
      ),
    },
  },
  zoom: {
    apiKey: env.require('ZOOM_API_KEY'),
    apiSecret: env.require('ZOOM_API_SECRET'),
    chatToken: env('ZOOM_IM_CHAT_HISTORY_TOKEN'),
    hostEmail: env.require('ZOOM_HOST_EMAIL'),
    url: env.require('ZOOM_BASE_URL'),
  },
};

export default () => appConfig;