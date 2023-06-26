import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IDriver } from '../../../types';
import { UserEntity } from './user.entity';
import { TransportTypeEntity } from './transport.entity';

@Entity({ name: 'drivers' })
export class DriverEntity implements IDriver {
  @PrimaryGeneratedColumn()
  id: number;

  @JoinColumn({
    name: 'user_id',
  })
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @Column({ name: 'user_id', unique: true })
  userId: bigint;

  @JoinColumn({
    name: 'transport_type_id',
  })
  @ManyToOne(() => TransportTypeEntity, (transportType) => transportType.id, {
    onDelete: 'CASCADE',
  })
  transportType: TransportTypeEntity;

  @Column({ type: 'varchar', name: 'full_name', unique: true })
  fullName: string;

  @Column({ type: 'varchar', name: 'car_number', unique: true })
  carNumber: string;

  @Column({ name: 'last_online' })
  lastOnline: Date;

  @Column({ type: 'varchar', nullable: true })
  latitude: string;

  @Column({ type: 'varchar', nullable: true })
  longitude: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ name: 'created_at' })
  createdAt: Date;
}
