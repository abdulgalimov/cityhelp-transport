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
