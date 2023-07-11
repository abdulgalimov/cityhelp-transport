export interface AppConfig {
  port: number;
  adminUsers: number[];
  webUrl: string;
}

export interface AuthConfig {
  jwtSecret: string;
}

export interface TelegramConfig {
  apiUrl: string;
  apiToken: string;
  secretToken: string;
  starting: boolean;
}

export interface DebugConfig {
  debugMode: boolean;
  loadFromFile: string;
  isTesting: boolean;
  isDocker: boolean;
}

export interface PgConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface EsConfig {
  node: string;
  user: string;
  pass: string;
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface SentryConfig {
  dsnUrl: string;
  environment: string;
}

export interface Config {
  app: AppConfig;
  telegram: TelegramConfig;
  auth: AuthConfig;
  pg: PgConfig;
  es: EsConfig;
  debug: DebugConfig;
  redis: RedisConfig;
  sentry: SentryConfig;
}
