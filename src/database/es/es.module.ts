import { Global, Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchInitializer } from './initializer';
import { EsConfig } from '../../config';
import { EsService } from './es.service';
import { DriverEsService } from './drivers';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const elasticDbConfig = config.getOrThrow<EsConfig>('es');

        return {
          node: elasticDbConfig.node,
          auth: {
            username: elasticDbConfig.user,
            password: elasticDbConfig.pass,
          },
        };
      },
    }),
  ],
  providers: [SearchInitializer, EsService, DriverEsService],
  exports: [EsService, DriverEsService],
})
export class EsModule {}
