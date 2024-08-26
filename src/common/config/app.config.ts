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
    clientUrl: env('APP_CLIENT_URL'),
    port: parseInt(env('PORT', '4000')),
    host: env(
      'HOST_NAME',
      `http://${env('HOST_NAME', 'localhost')}:${parseInt(
        env('PORT', '4000'),
      )}`,
    ),
    timezone: env('TZ', 'Africa/Lagos'),
    version: env('VERSION', '1.0.0'),
  },
  aws: {
    S3Region: env('AWS_S3_REGION'),
    S3Key: env('AWS_S3_ACCESS_KEY_ID'),
    S3Secret: env('AWS_S3_ACCESS_KEY_SECRET'),
    S3Bucket: env('AWS_S3_BUCKET'),
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
    url: env.require('DATABASE_URL'),
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
    expiry: parseInt(env('JWT_EXPIRATION_TIME', 30 * 60)),
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
    host: env.require('REDIS_HOST', 'localhost'),
    port: parseInt(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD'),
    ttl: parseInt(env('REDIS_TTL', 3600)),
    url: env('REDIS_URL'),
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
  smtp: {
    transport: {
      host: env('SMTP_HOST'),
      port: Number(env('SMTP_PORT', 587)),
      secure: env('SMTP_SECURE') === 'true',
      auth: {
        user: env('SMTP_USER'),
        pass: env('SMTP_PASSWORD'),
      },
    },
    defaults: {
      from: {
        name: env('EMAIL_SENDER_NAME'),
        address: env('EMAIL_SENDER_ADDRESS'),
      },
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
  transaction_time: {
    MAX_TIME: env('MAX_WAIT', 60000),
    TIME_OUT: env('TIME_OUT', 65000),
  },
  zoom: {
    apiKey: env('ZOOM_API_KEY'),
    apiSecret: env('ZOOM_API_SECRET'),
    chatToken: env('ZOOM_IM_CHAT_HISTORY_TOKEN'),
    hostEmail: env('ZOOM_HOST_EMAIL'),
    url: env('ZOOM_BASE_URL'),
  },
};

export default () => appConfig;
