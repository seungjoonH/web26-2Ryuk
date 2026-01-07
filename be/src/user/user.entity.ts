import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PrimaryUuidColumn } from '@src/common/decorators/primary-uuid-column.decorator';

@Entity('user')
export class User {
  @PrimaryUuidColumn()
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 8 })
  nickname: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profile_image: string | null;

  @Column({
    type: 'enum',
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  })
  role: string;

  @Column({ type: 'boolean', default: false })
  is_blacklisted: boolean;

  @Column({ type: 'int', default: 0 })
  warning_count: number;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  update_date: Date | null;
}
