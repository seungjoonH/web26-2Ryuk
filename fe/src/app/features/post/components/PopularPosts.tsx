'use client';

import styles from './post.module.css';
import PostListItem from './PostListItem';
import * as IconCircle from '@/app/components/shared/icon/IconCircle';
import * as IconButton from '@/app/components/shared/icon/IconButton';
import { PopularPostsSectionProps } from './type';

export default function PopularPosts({ posts, viewCount = 2 }: PopularPostsSectionProps) {
  const visiblePosts = posts.slice(0, viewCount);

  return (
    <div className={styles.popularPosts}>
      <div className={styles.popularPostsHeader}>
        <div className={styles.popularPostsTitle}>
          <IconCircle.Secondary name="stock" size="medium" />
          <h3 className={styles.popularPostsTitleText}>실시간 인기 글</h3>
        </div>
        <IconButton.Ghost name="right" size="medium" />
      </div>
      <ul className={styles.postListItems}>
        {visiblePosts.map((post) => (
          <PostListItem
            key={post.id}
            id={post.id}
            title={post.title}
            tags={post.tags}
            createDate={post.createDate}
            updateDate={post.updateDate}
            viewCount={post.viewCount}
            likeCount={post.likeCount}
            commentCount={post.commentCount}
          />
        ))}
      </ul>
    </div>
  );
}
