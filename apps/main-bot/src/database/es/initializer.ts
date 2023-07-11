import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Injectable } from '@nestjs/common';
import { EsService } from './es.service';

@Injectable()
export class SearchInitializer {
  constructor(searchService: EsService, es: ElasticsearchService) {
    searchService.init(es);
  }
}
