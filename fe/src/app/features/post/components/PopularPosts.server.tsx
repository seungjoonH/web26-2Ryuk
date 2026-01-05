import PopularPosts from './PopularPosts';
import postService from '../services/PostsService';
import { PostConverter } from '../dtos/Post';

export interface PopularPostsSectionServerProps {
  viewCount?: number;
}

export async function PopularPostsSection({ viewCount = 2 }: PopularPostsSectionServerProps) {
  const result = await postService.getPopularPosts(viewCount);
  const posts = result.posts;

  const convertedPosts = posts.map((post) => PostConverter.toData(post));
  return <PopularPosts posts={convertedPosts} viewCount={viewCount} />;
}
