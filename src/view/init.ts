import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

export function initView(app: NestExpressApplication) {
  const path = [__dirname, '..', '..', 'src', 'view', 'templates'];

  app.setBaseViewsDir(join(...path));
  app.useStaticAssets(join(...path));

  app.setViewEngine('hbs');
}
