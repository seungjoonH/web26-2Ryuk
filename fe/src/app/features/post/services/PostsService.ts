import { HttpService } from '@/app/services/http.service';
import { PopularPostsDto } from './type';

class PostService {
  async getPopularPosts(limit: number = 2): Promise<PopularPostsDto> {
    // TODO: 실제 API 엔드포인트로 교체
    const response = await HttpService.get<PopularPostsDto>('/api/posts/popular?limit=' + limit);

    return {
      posts: response.posts,
      totalCount: response.totalCount,
    };
  }
}

const postsService = new PostService();
export default postsService;
