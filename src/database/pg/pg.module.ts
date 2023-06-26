import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PgConfig } from '../../config';
import {
  AdminEntity,
  DriverEntity,
  TransportTypeEntity,
  UserEntity,
  ProfileEntity,
} from './entities';
import {
  AdminPgService,
  DriverPgService,
  ProfilePgService,
  TransportTypePgService,
  UserPgService,
} from './services';

const entities = [
  UserEntity,
  TransportTypeEntity,
  DriverEntity,
  AdminEntity,
  ProfileEntity,
];
const services = [
  UserPgService,
  TransportTypePgService,
  DriverPgService,
  AdminPgService,
  ProfilePgService,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const pgConfig: PgConfig = configService.getOrThrow('pg');

        return {
          type: 'postgres',
          host: pgConfig.host,
          port: pgConfig.port,
          username: pgConfig.username,
          password: pgConfig.password,
          database: pgConfig.database,
          entities,
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [...services],
  exports: [...services],
})
export class PgModule {}
