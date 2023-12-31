import { IUser } from './users';

export interface ITransportType {
  id: number;
  title: string;
}

export interface IDriver {
  id: number;
  user: IUser;
  fullName: string;
  transportType: ITransportType;
  carNumber: string;
  phone: string;
  latitude: string;
  longitude: string;
  lastOnline: Date;
}

export type ICreateDriver = Omit<
  IDriver,
  'id' | 'lastOnline' | 'latitude' | 'longitude'
>;

export interface IFoundDriver {
  driver: IDriver;
  distance?: number;
}
