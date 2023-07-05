import { IDriver, ILocation, ITransportType } from '../../../types';

export interface IFindOptions {
  query?: string;
  transportType?: ITransportType;
  location?: ILocation;
}

export interface IFindSettings {
  maxRadius: number;
  boostGeoScore: number;
  pivotGeoScore: number;

  transportTitleScore: number;
  fullNameScore: number;
  carNumberScore: number;
  phoneNumberScore: number;

  matchType: MatchTypes;
  fuzziness: string;
  fuzzyTranspositions: boolean;
  tieBreaker: number;
  operator: string;
}

export enum MatchTypes {
  BEST_FIELDS = 'best_fields',
  MOST_FIELDS = 'most_fields',
  CROSS_FIELDS = 'cross_fields',
  PHRASE = 'phrase',
  PHRASE_PREFIX = 'phrase_prefix',
  BOOL_PREFIX = 'bool_prefix',
}

export interface IEsDriver {
  id: number;
  transport: {
    id: number;
    title: string;
  };
  fullName: string;
  carNumber: string;
  phoneNumber: string;
  location: {
    lat: number;
    lon: number;
  };
  lastOnline: number;
}
