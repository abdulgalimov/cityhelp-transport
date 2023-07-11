import { Global, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisManager } from '@liaoliaots/nestjs-redis';

@Global()
@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private readonly redisManager: RedisManager) {
    const redis = this.redisManager.clients.get('default');
    if (!redis) {
      throw new Error('invalid get redis client');
    }
    this.client = redis;
  }

  public async getValue<T>(key: string, defaultValue: T): Promise<T> {
    const str = await this.client.get(key);
    return str ? JSON.parse(str) : defaultValue;
  }

  public setValue<T>(key: string, data: T) {
    const str = JSON.stringify(data);

    this.client.set(key, str);
  }
}
