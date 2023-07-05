import {
  CallHandler,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AdminPgService,
  DriverPgService,
  ProfilePgService,
  TransportTypePgService,
  UserPgService,
} from '../database/pg/services';
import {
  IAdmin,
  IDbData,
  IDriver,
  InputRequest,
  IProfile,
  IUser,
} from '../types';

@Injectable()
export class DbServices implements NestInterceptor, CanActivate {
  @Inject(AdminPgService)
  private readonly admins: AdminPgService;

  @Inject(UserPgService)
  private readonly users: UserPgService;

  @Inject(ProfilePgService)
  private readonly profiles: ProfilePgService;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.init(context);
    return next.handle();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.init(context);
    return true;
  }

  private init(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as InputRequest;
    request.db = {
      managers: {
        admins: this.admins,
        users: this.users,
        profiles: this.profiles,
      },
      data: new DbData(),
    };
  }
}

export class DbData implements IDbData {
  public admin: IAdmin;
  public user: IUser;
  public driver: IDriver;
  public profile: IProfile | null;

  private values: Map<string, any> = new Map();

  setValue<T>(key: string, value: T) {
    this.values.set(key, value);
  }
  getValue<T>(key: string): T {
    return this.values.get(key);
  }
}
