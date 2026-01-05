// 채팅 메시지 DTO
// 백엔드 소통 시 사용
export interface ChatDto {
  // 채팅 고유 아이디
  id: string;

  // 채팅 메시지
  message: string;

  // 채팅 메시지 작성 시간
  createDate: string;

  // 채팅 메시지 수정 시간
  updateDate: string;

  // 채팅 메시지 작성자 아이디
  authorId: string;

  // 채팅 메시지 작성자 닉네임
  authorNickname: string;

  // 채팅 메시지 본인 여부
  isMe: boolean;
}

// 채팅 메시지 데이터
// 프론트엔드 컴포넌트 내부 사용
export interface ChatData {
  // 채팅 고유 아이디
  id: string;

  // 채팅 본인 여부
  isMe: boolean;

  // 채팅 메시지
  message: string;

  // 채팅 메시지 작성 시간
  createDate: Date;

  // 채팅 메시지 수정 시간
  updateDate?: Date;

  // 채팅 메시지 작성자 아이디
  authorId: string;

  // 채팅 메시지 작성자 닉네임
  authorNickname: string;
}

// 전역 채팅 DTO
// 백엔드 소통 시 사용
export interface GlobalChatDto {
  onlineCount: number;
  chats: ChatDto[];
}

// 전역 채팅 데이터
// 프론트엔드 컴포넌트 내부 사용
export interface GlobalChatData {
  onlineCount: number;
  chats: ChatData[];
}
