import { Entity, Column, CreateDateColumn, Index } from 'typeorm';
import {
  PrimaryUuidColumn,
  UuidColumn,
} from '@src/common/decorators/primary-uuid-column.decorator';

export enum RoomType {
  GLOBAL = 'GLOBAL',
  LOCAL = 'LOCAL',
}

@Entity('chatting_log')
export class ChattingLog {
  @PrimaryUuidColumn()
  id: string;

  @Index() // 방별 채팅 조회를 위해 인덱스 추가
  @UuidColumn({ nullable: true })
  room_id: string;

  @UuidColumn()
  sender_id: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_date: Date;

  @Column({
    type: 'enum',
    enum: RoomType,
  })
  room_type: RoomType;
}
