import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PrimaryUuidColumn, UuidColumn } from '@src/common/decorators/primary-uuid-column.decorator';
import { User } from '@src/modules/user/user.entity';
import { Game } from '@src/modules/game/game.entity';

@Entity('game_record')
export class GameRecord {
  @PrimaryUuidColumn()
  id: string;

  @UuidColumn()
  user_id: string;

  @UuidColumn()
  game_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Game, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'timestamp', nullable: true })
  achieve_date: Date;
}
