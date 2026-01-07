import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PrimaryUuidColumn } from '@src/common/decorators/primary-uuid-column.decorator';
import { Post } from '@src/post/post.entity';
import { User } from '@src/user/user.entity';

@Entity('post-like')
export class PostLike {
  @PrimaryUuidColumn()
  post_id: string;

  @PrimaryUuidColumn()
  user_id: string;

  @ManyToOne(() => Post, (post) => post.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
