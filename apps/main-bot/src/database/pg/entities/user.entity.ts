import { Entity, Column, PrimaryColumn } from 'typeorm';
import { IUser } from '../../../types';

@Entity({ name: 'users' })
export class UserEntity implements IUser {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'first_name', type: 'varchar' })
  firstName: string;

  @Column({ name: 'last_name', nullable: true, type: 'varchar' })
  lastName: string | null;

  @Column({ type: 'varchar', nullable: true })
  username: string | null;

  @Column({ name: 'is_premium', default: false })
  isPremium: boolean;

  @Column({ name: 'is_bot', default: false })
  isBot: boolean;

  @Column({ name: 'language_code', nullable: true, type: 'varchar' })
  languageCode: string | null;

  @Column({ name: 'supports_inline_queries', default: false })
  supportsInlineQueries: boolean;

  @Column()
  createdAt: Date;
}
