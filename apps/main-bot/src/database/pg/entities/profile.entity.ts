import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IProfile, ProfileTypes } from '../../../types';

@Entity({ name: 'profiles' })
export class ProfileEntity implements IProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', unique: true })
  userId: number;

  @Column({ type: 'varchar' })
  type: ProfileTypes;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
