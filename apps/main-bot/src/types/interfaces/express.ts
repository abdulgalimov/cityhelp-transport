import { Request } from 'express';
import { IUser } from './users';
import { IJwtTokenPayload } from './auth';
import {
  AdminPgService,
  DriverPgService,
  ProfilePgService,
  TransportTypePgService,
  UserPgService,
} from '../../database/pg/services';
import { IAdmin } from './admins';
import { IProfile } from './profiles';
import { IDriver } from './driver';

declare module 'express' {
  interface Request {
    readonly jwtPayload: IJwtTokenPayload;
    user: IUser;
    db: {
      managers: IDbManagers;
      data: IDbData;
    };
  }
}

export interface IDbManagers {
  admins: AdminPgService;
  users: UserPgService;
  profiles: ProfilePgService;
}

export interface IDbData {
  admin: IAdmin | null;
  driver: IDriver;
  profile: IProfile | null;

  setValue<T>(key: string, value: T);
  getValue<T>(key: string): T;
}

export type InputRequest = Request;
