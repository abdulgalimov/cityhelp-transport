import { Injectable, Scope } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable({ scope: Scope.DEFAULT })
export class EsService {
  private es: ElasticsearchService;

  public init(es: ElasticsearchService) {
    this.es = es;
  }
}
