import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { IUser } from '../../../types';

@Injectable()
export class UserPgService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getById(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getFrom(from: any): Promise<IUser> {
    const user = await this.userRepository.findOne({
      where: {
        id: from.id,
      },
    });
    if (user) {
      return user;
    }

    const data: UserEntity = {
      id: from.id,
      firstName: from.first_name,
      lastName: from.last_name,
      username: from.username ? `@${from.username}` : null,
      isBot: !!from.is_bot,
      isPremium: !!from.is_premium,
      languageCode: from.language_code || null,
      supportsInlineQueries: !!from.supports_inline_queries,
      createdAt: new Date(),
    };

    await this.userRepository.insert(data);

    return data;
  }
}
