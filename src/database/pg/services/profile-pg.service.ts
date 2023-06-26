import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProfile, ProfileTypes } from '../../../types';
import { ProfileEntity } from '../entities';

@Injectable()
export class ProfilePgService {
  constructor(
    @InjectRepository(ProfileEntity)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  async getByUserId(userId: number): Promise<IProfile | null> {
    return this.profileRepository.findOne({
      where: {
        userId,
      },
    });
  }

  async update(userId, type: ProfileTypes): Promise<IProfile> {
    const { raw } = await this.profileRepository.upsert(
      {
        userId,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { upsertType: 'on-duplicate-key-update', conflictPaths: ['userId'] },
    );

    const profile = await this.profileRepository.findOne({
      where: {
        id: raw[0].id,
      },
    });

    if (!profile) {
      throw new Error('Create profile failed');
    }

    return profile;
  }
}
