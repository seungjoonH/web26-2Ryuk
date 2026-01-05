import { PostListItemDto } from '../dtos/type';

export interface PopularPostsDto {
  posts: PostListItemDto[];
  totalCount?: number;
}
