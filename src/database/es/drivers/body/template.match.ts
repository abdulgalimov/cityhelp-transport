import { IFindOptions, IFindSettings, MatchTypes } from '../types';

export function addTemplateMultiMatch(
  body,
  options: IFindOptions,
  findSettings: IFindSettings,
) {
  const template = options.query;
  if (!template) return;

  const findFields: string[] = [];

  if (findSettings.transportTitleScore) {
    findFields.push(`transport.title^${findSettings.transportTitleScore}`);
  }
  if (findSettings.fullNameScore) {
    findFields.push(`fullName^${findSettings.fullNameScore}`);
  }
  if (findSettings.carNumberScore) {
    findFields.push(`carNumber^${findSettings.carNumberScore}`);
  }
  if (findSettings.phoneNumberScore) {
    findFields.push(`phoneNumber^${findSettings.phoneNumberScore}`);
  }

  const useMatchType = findSettings.matchType;
  const multiMatch: any = {
    query: template,
    fields: findFields,
    type: useMatchType,
    analyzer: 'russian',
  };
  switch (useMatchType) {
    case MatchTypes.BEST_FIELDS:
      multiMatch.tie_breaker = findSettings.tieBreaker;
      multiMatch.fuzziness = findSettings.fuzziness;
      multiMatch.fuzzy_transpositions = findSettings.fuzzyTranspositions;
      multiMatch.operator = findSettings.operator;
      break;
    case MatchTypes.MOST_FIELDS:
      multiMatch.fuzziness = findSettings.fuzziness;
      multiMatch.operator = findSettings.operator;
      break;
    case MatchTypes.CROSS_FIELDS:
      multiMatch.operator = findSettings.operator;
      break;
    case MatchTypes.PHRASE:
    case MatchTypes.PHRASE_PREFIX:
      break;
    case MatchTypes.BOOL_PREFIX:
      multiMatch.fuzziness = findSettings.fuzziness;
      multiMatch.fuzzy_transpositions = findSettings.fuzzyTranspositions;
      multiMatch.operator = findSettings.operator;
      multiMatch.tie_breaker = findSettings.tieBreaker;
      // multiMatch.lenient = false;
      break;
  }

  body.query.bool.must = [
    {
      multi_match: multiMatch,
    },
  ];
}
