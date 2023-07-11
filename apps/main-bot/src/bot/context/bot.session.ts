import { RedisService } from '../../database/redis';
import { IUser } from '../../types';
import { Pages } from '../pages';

export class BotSession {
  private readonly key: string;
  private data: Record<string, any>;
  constructor(
    private readonly user: IUser,
    private readonly redisService: RedisService,
  ) {
    this.key = `user-session:${this.user.id}`;
  }

  async init() {
    this.data = await this.redisService.getValue(this.key, {});
  }

  save() {
    return this.redisService.setValue(this.key, this.data);
  }

  public set pageName(value: Pages | undefined) {
    this.data.pageName = value;
    this.save();
  }
  public get pageName(): Pages | undefined {
    return this.data.pageName;
  }
}
