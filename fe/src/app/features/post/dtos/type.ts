export type PostCategory = 'notice' | 'free';

// 게시글 DTO
// 백엔드 소통 시 사용
export interface PostListItemDto {
  // 게시글 고유 아이디
  id: string;

  // 게시글 제목
  title: string;

  // 게시글 태그
  tags: string[];

  // 게시글 작성 시간
  createDate: string;

  // 게시글 수정 시간
  updateDate: string;

  // 조회수
  viewCount: number;

  // 좋아요 수
  likeCount: number;

  // 댓글 수
  commentCount: number;
}

// 게시글 데이터
// 프론트엔드 컴포넌트 내부 사용
export interface PostListItemData {
  // 게시글 고유 아이디
  id: string;

  // 게시글 제목
  title: string;

  // 게시글 태그
  tags: string[];

  // 게시글 작성 시간
  createDate: Date;

  // 게시글 수정 시간
  updateDate?: Date;

  // 조회수
  viewCount: number;

  // 좋아요 수
  likeCount: number;

  // 댓글 수
  commentCount: number;
}

// 별칭 (하위 호환성)
export type PostDto = PostListItemDto;
export type PostData = PostListItemData;

// id={post.id}
// title={post.title}
// createDate={post.createDate}
// updateDate={post.updateDate}
// content={post.content}
// viewCount={post.viewCount}
// likeCount={post.likeCount}
// commentCount={post.commentCount}

// 게시글 행 DTO
// 백엔드 소통 시 사용
export interface PostListRowDto {
  // 게시글 고유 아이디
  id: string;

  // 게시글 제목
  title: string;

  // 게시글 내용
  content: string;

  // 게시글 작성 시간
  createDate: string;

  // 게시글 수정 시간
  updateDate: string;

  // 게시글 작성자 아이디
  authorId: string;

  // 게시글 작성자 닉네임
  authorNickname: string;

  // 게시글 본인 여부
  isMe: boolean;

  // 게시글 카테고리
  category: PostCategory;

  // 조회수
  viewCount: number;

  // 좋아요 수
  likeCount: number;

  // 댓글 수
  commentCount: number;
}

// 게시글 행 데이터
// 프론트엔드 컴포넌트 내부 사용
export interface PostListRowData {
  // 게시글 고유 아이디
  id: string;

  // 게시글 제목
  title: string;

  // 게시글 내용
  content: string;

  // 게시글 작성 시간
  createDate: Date;

  // 게시글 수정 시간
  updateDate?: Date;

  // 게시글 작성자 아이디
  authorId: string;

  // 게시글 작성자 닉네임
  authorNickname: string;

  // 게시글 본인 여부
  isMe: boolean;

  // 게시글 카테고리
  category: PostCategory;

  // 조회수
  viewCount: number;

  // 좋아요 수
  likeCount: number;

  // 댓글 수
  commentCount: number;
}
