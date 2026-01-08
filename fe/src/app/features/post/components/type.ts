import { PostListItemData, PostListRowData } from '@/app/features/post/dtos/type';

export interface PostListItemProps extends PostListItemData {}

export interface PostListRowProps extends PostListRowData {}

export interface PopularPostsSectionProps {
  posts: PostListItemData[];
  viewCount?: number;
}

export interface PopularPostsSectionServerProps {
  viewCount?: number;
}
