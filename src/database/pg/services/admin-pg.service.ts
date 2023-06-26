import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AdminEntity, UserEntity } from '../entities';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config';

@Injectable()
export class AdminPgService implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async onModuleInit() {
    const appConfig = this.config.getOrThrow<AppConfig>('app');

    const users = await this.userRepository.find({
      where: {
        id: In(appConfig.adminUsers),
      },
    });

    const adminsToCreate = users.map((user) => ({
      user,
      updatedAt: new Date(),
    }));

    await this.adminRepository.upsert(adminsToCreate, {
      upsertType: 'on-conflict-do-update',
      conflictPaths: ['user'],
      skipUpdateIfNoValuesChanged: true,
    });
  }

  async findById(userId): Promise<AdminEntity | null> {
    return this.adminRepository.findOne({
      where: {
        user: { id: userId },
      },
    });
  }
}
