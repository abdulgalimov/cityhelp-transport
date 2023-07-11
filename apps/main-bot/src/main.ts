import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { initSentry } from './sentry';
import { AppConfig } from './config';
import { addSwagger } from './utils/swagger';
import { json, urlencoded } from 'express';
import { initView } from './view/init';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const appConfig = config.getOrThrow<AppConfig>('app');

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));

  initSentry(app);
  addSwagger(app);
  initView(app);
  //app.use(allRequestsLogger());

  await app.listen(appConfig.port);

  console.log(`App started on port ${appConfig.port}`);
}

bootstrap();
