import { Injectable } from '@nestjs/common';
import { BasePage } from '../base.page';
import { Pages } from '../types';
import { Methods, UpdateResult } from '../../types';
import { BotContext } from '../../context';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';
import { ProfileTypes, WebDataActionTypes } from '../../../types';
import { DriverEsService } from '../../../database/es/drivers';

@Injectable()
export class RegisterPage extends BasePage {
  private readonly appConfig: AppConfig;
  constructor(
    configService: ConfigService,
    private readonly driverEsService: DriverEsService,
  ) {
    super({
      name: Pages.DRIVER_REGISTER,
    });

    this.appConfig = configService.getOrThrow<AppConfig>('app');
  }

  private main(ctx: BotContext) {
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: ctx.user.id,
        text: `Чтобы зарегистрироваться как водитель, нажмите кнопку <b>Регистрация</b> и заполните анкету`,
        parse_mode: 'HTML',
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: 'Регистрация',
                web_app: {
                  url: `${this.appConfig.webUrl}/register-driver`,
                },
              },
            ],
          ],
        },
      },
    };
  }

  public async open(ctx: BotContext): Promise<UpdateResult | void> {
    await super.open(ctx);

    return this.main(ctx);
  }

  public async execute(ctx: BotContext): Promise<UpdateResult | void> {
    const webApp = ctx.webApp;
    if (webApp?.action == WebDataActionTypes.REGISTER_DRIVER) {
      const { db, user } = ctx.req;
      const [driver, profile] = await Promise.all([
        db.managers.drivers.create({
          user,
          fullName: webApp.data.name,
          transportType: webApp.data.transportType,
          phone: webApp.data.phone,
          carNumber: webApp.data.carNumber,
        }),
        db.managers.profiles.update(user.id, ProfileTypes.DRIVER),
      ]);

      await this.driverEsService.createDriver(driver);

      ctx.req.db.data.driver = driver;
      ctx.req.db.data.profile = profile;
      return this.manager.open(Pages.DRIVER, ctx);
    }
  }
}
