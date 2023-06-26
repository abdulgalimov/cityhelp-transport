import { IFindOptions, IFindSettings, MatchTypes } from '../types';
import { addLocationMatch } from './location.match';
import { addTemplateMultiMatch } from './template.match';

export function getFindBody(options: IFindOptions) {
  const body: any = {
    stored_fields: ['_source'],
    min_score: 0,
    size: 10,
    query: {
      bool: {
        should: [],
        filter: {
          bool: {
            should: [],
          },
        },
      },
    },
  };

  if (options.transportType) {
    body.query.bool.filter.bool.should.push({
      term: { 'transport.id': options.transportType.id },
    });
  }

  const settings: IFindSettings = {
    maxRadius: 100,
    pivotGeoScore: 1000,
    boostGeoScore: 1000,

    transportTitleScore: 10,
    fullNameScore: 10,
    carNumberScore: 10,
    phoneNumberScore: 10,

    matchType: MatchTypes.BOOL_PREFIX,
    fuzziness: 'AUTO',
    fuzzyTranspositions: true,
    operator: 'OR',
    tieBreaker: 1,
  };

  addLocationMatch(body, options, settings, false);

  addTemplateMultiMatch(body, options, settings);

  return body;
}
