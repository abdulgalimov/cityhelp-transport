import * as dotenv from 'dotenv';
import * as process from 'process';
import {
  AppConfig,
  AuthConfig,
  Config,
  DebugConfig,
  EsConfig,
  PgConfig,
  RedisConfig,
  SentryConfig,
  TelegramConfig,
} from './types';

function loadEnv() {
  const isTesting = process.env.TS_JEST === '1';
  const isDocker = process.env.IN_DOCKER === 'true';
  let filename;
  if (isTesting) {
    filename = '.test.env';
  } else if (isDocker) {
    filename = '.docker.env';
  } else {
    filename = '.local.env';
  }
  const { parsed } = dotenv.config({
    path: filename,
  });
  if (!parsed) {
    throw new Error('invalid env parsed');
  }

  return {
    ...parsed,
    isTesting,
    isDocker,
  };
}
const env = loadEnv();

function requiredEnv(key: string) {
  if (!(key in env)) {
    throw new Error(`Not found env value ${key}`);
  }
  return env[key];
}

function loadAdminUsers(): number[] {
  if (!env['ADMIN_USERS']) return [];
  return env['ADMIN_USERS']
    .split(',')
    .map((item) => +item)
    .filter((id) => !!id);
}

function loadPgConfig(): PgConfig {
  return {
    host: requiredEnv('PG_HOST'),
    port: requiredEnv('PG_PORT'),
    username: requiredEnv('PG_USER'),
    password: requiredEnv('PG_PASSWORD'),
    database: requiredEnv('PG_DATABASE'),
  };
}

export function loadEsConfig(): EsConfig {
  return {
    node: requiredEnv('ES_NODE'),
    user: requiredEnv('ES_USER'),
    pass: requiredEnv('ES_PASS'),
  };
}

function loadDebugConfig(): DebugConfig {
  return {
    debugMode: env['DEBUG_MODE'] === 'true',
    loadFromFile: env['DEBUG_LOAD_FROM_FILE'],
    isTesting: env.isTesting,
    isDocker: env.isDocker,
  };
}

function loadRedisConfig(): RedisConfig {
  return {
    host: requiredEnv('REDIS_HOST'),
    port: +requiredEnv('REDIS_PORT'),
  };
}

function loadSentryConfig(): SentryConfig {
  return {
    dsnUrl: env['SENTRY_DSN_URL'],
    environment: env['SENTRY_ENVIRONMENT'],
  };
}

export function loadAppConfig(): AppConfig {
  return {
    adminUsers: loadAdminUsers(),
    port: +requiredEnv('APP_PORT'),
    webUrl: requiredEnv('WEB_URL'),
  };
}

export function loadTelegramConfig(): TelegramConfig {
  return {
    apiUrl: requiredEnv('TELEGRAM_API_URL'),
    apiToken: requiredEnv('TELEGRAM_TOKEN'),
    secretToken: requiredEnv('TELEGRAM_SECRET'),
    starting: true,
  };
}

export function loadAuthConfig(): AuthConfig {
  return {
    jwtSecret: requiredEnv('JWT_SECRET'),
  };
}

export function loadConfig(): Config {
  return {
    app: loadAppConfig(),
    telegram: loadTelegramConfig(),
    auth: loadAuthConfig(),
    pg: loadPgConfig(),
    es: loadEsConfig(),
    debug: loadDebugConfig(),
    redis: loadRedisConfig(),
    sentry: loadSentryConfig(),
  };
}
