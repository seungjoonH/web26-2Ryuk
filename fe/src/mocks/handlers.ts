/**
 * MSW 핸들러 정의
 *
 * 개발 환경에서 API 요청을 모킹하기 위한 핸들러들을 정의
 */
import { http, HttpResponse } from 'msw';
import roomsMock from './data/rooms.json';
import globalChatMock from './data/globalChat.json';
import postListCardMock from './data/postListCard.json';
import postListTableMock from './data/postListTable.json';
import profilesMock from './data/profiles.json';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const handlers = [
  // Rooms API
  http.get(`${baseUrl}/api/rooms`, () => {
    return HttpResponse.json(roomsMock);
  }),

  // Global Chat API
  http.get(`${baseUrl}/api/chat/global`, () => {
    return HttpResponse.json(globalChatMock);
  }),

  // Popular Posts API
  http.get(`${baseUrl}/api/posts/popular`, ({ request }) => {
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit');

    // limit 파라미터가 있으면 posts를 제한
    if (limit) {
      const limitNum = parseInt(limit, 10);
      return HttpResponse.json({
        ...postListCardMock,
        posts: postListCardMock.posts.slice(0, limitNum),
      });
    }

    return HttpResponse.json(postListCardMock);
  }),

  // Posts Table API
  http.get(`${baseUrl}/api/posts`, () => {
    return HttpResponse.json(postListTableMock);
  }),

  // User Profile API
  http.get(`${baseUrl}/api/users/:userId/profile`, ({ params }) => {
    const { userId } = params;
    const profile = profilesMock.find((p) => p.id === userId);

    if (!profile) {
      return HttpResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return HttpResponse.json(profile);
  }),

  // Profiles API (전체 프로필 목록)
  http.get(`${baseUrl}/api/profiles`, () => {
    return HttpResponse.json(profilesMock);
  }),
];
