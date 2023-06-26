import { InputRequest, IUser, WebDataAction } from '../../types';
import { Update, WebAppData } from '@grammyjs/types';
import { RedisService } from '../../database/redis';
import { BotSession } from './bot.session';

export class BotContext {
  public readonly user: IUser;
  public readonly session: BotSession;
  public readonly webApp: WebDataAction | undefined;

  constructor(
    public readonly req: InputRequest,
    public readonly update: Update,
    private redisService: RedisService,
  ) {
    this.user = req.user;
    this.session = new BotSession(this.user, this.redisService);
    if (update.message?.web_app_data) {
      this.webApp = parseWebData(update.message?.web_app_data);
    }
  }

  async init() {
    await this.session.init();
  }
}

function parseWebData(
  tgData: WebAppData | undefined,
): WebDataAction | undefined {
  console.log('tgData', tgData);
  if (!tgData) return;

  const webData = JSON.parse(tgData.data);

  return {
    action: webData.action,
    data: webData.data,
  };
}
