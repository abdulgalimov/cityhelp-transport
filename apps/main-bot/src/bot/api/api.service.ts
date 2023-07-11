import {
  Global,
  Injectable,
  OnApplicationBootstrap,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { AppConfig, DebugConfig, TelegramConfig } from '../../config';
import { SendMessageArgs, SetMyCommandsArgs } from '../types';

@Global()
@Injectable({ scope: Scope.DEFAULT })
export class BotApiService implements OnApplicationBootstrap {
  private readonly tgConfig: TelegramConfig;
  private readonly appConfig: AppConfig;
  private readonly debugConfig: DebugConfig;

  private botUsername: string;

  constructor(config: ConfigService) {
    this.tgConfig = config.getOrThrow<TelegramConfig>('telegram');
    this.appConfig = config.getOrThrow<AppConfig>('app');
    this.debugConfig = config.getOrThrow<DebugConfig>('debug');
  }

  async onApplicationBootstrap(): Promise<any> {
    if (!this.debugConfig.isTesting) {
      const me = await this.callApi('getMe', {});
      this.botUsername = me.result.username;
      await this.setWebhook();
    }
  }

  public getBotUsername(): string {
    return this.botUsername;
  }

  public async callApi(method: string, body: object = {}) {
    const url = `${this.tgConfig.apiUrl}/bot${this.tgConfig.apiToken}/${method}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        ...body,
        disable_notification: this.debugConfig.isTesting,
      }),
    };
    return fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        // console.log(`${method} => ${JSON.stringify(res, null, 2)}`);
        return res;
      });
  }

  async setWebhook() {
    const url = `${this.appConfig.webUrl}/bot/update`;
    console.log('url', url);
    return this.callApi('setWebhook', {
      url,
      secret_token: this.tgConfig.secretToken,
    });
  }

  async answerInlineQuery(body) {
    return this.callApi('answerInlineQuery', body);
  }

  async sendMessage(body: SendMessageArgs) {
    return this.callApi('sendMessage', body);
  }

  async setCommands(body: SetMyCommandsArgs) {
    return this.callApi('setMyCommands', body);
  }

  deleteMessage(chatId: number | string, messageId: number) {
    return this.callApi('deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
  }
}
