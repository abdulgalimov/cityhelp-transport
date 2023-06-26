import { Inject, Injectable } from '@nestjs/common';
import { InputRequest, ProfileTypes, WebDataActionTypes } from '../../types';
import { Methods, ResultSendMessage, UpdateResult } from '../types';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config';
import { DriverHandler } from './driver.handler';

@Injectable()
export class StartHandler {
  private appConfig: AppConfig;

  constructor(
    config: ConfigService,
    private readonly driverHandler: DriverHandler,
  ) {
    this.appConfig = config.getOrThrow<AppConfig>('app');
  }

  public async update(req: InputRequest): Promise<UpdateResult | void> {
    /*
    const text = req.tg.update.message?.text;

    if (req.tg.webData) {
      return this.executeWebData(req);
    }

    switch (text) {
      case 'Я водитель':
        return this.iAmDriver(req);
    }
    return this.main(req);
     */
  }

  private main(req: InputRequest): ResultSendMessage {
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: req.user.id,
        text: 'Укажите пожалуйста как вы хотите пользоваться ботом?',
        reply_markup: {
          resize_keyboard: true,
          keyboard: [
            [
              {
                text: 'Я водитель',
              },
            ],
            [
              {
                text: 'Мне нужен транспорт',
              },
            ],
          ],
        },
      },
    };
  }

  private iAmDriver(req: InputRequest): ResultSendMessage {
    return {
      method: Methods.sendMessage,
      body: {
        chat_id: req.user.id,
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

  private async executeWebData(req: InputRequest) {
    /*
    const { tg, db, user } = req;
    const { action, data } = tg.webData!;

    console.log('action', action);
    if (action === WebDataActionTypes.REGISTER_DRIVER) {
      try {
        const [driver, profile] = await Promise.all([
          db.managers.drivers.create({
            user,
            fullName: data.name,
            transportType: data.transportType,
            phone: data.phone,
            carNumber: data.carNumber,
          }),
          db.managers.profiles.update(user.id, ProfileTypes.DRIVER),
        ]);

        req.db.data.profile = profile;
        await this.driverHandler.update(req);
      } catch (err) {
        console.log('err', err);
      }
    }
     */
  }
}
