import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
  Column,
} from 'typeorm';
import { IAdmin } from '../../../types';
import { UserEntity } from './user.entity';

@Entity({ name: 'admins' })
export class AdminEntity implements IAdmin {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({
    name: 'user_id',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  @Index({
    unique: true,
  })
  user: UserEntity;

  @Column({ name: 'updated_at' })
  updatedAt: Date;
}
