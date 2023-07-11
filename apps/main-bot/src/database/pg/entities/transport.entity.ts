import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ITransportType } from '../../../types/interfaces/driver';

@Entity({ name: 'transport_types' })
export class TransportTypeEntity implements ITransportType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  title: string;
}
