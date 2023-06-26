import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as RedisModuleNest } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule,
    RedisModuleNest.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const config = configService.getOrThrow('redis');
        return {
          config,
          connectionName: 'temp',
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
