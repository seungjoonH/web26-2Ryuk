import ParseUtil from '@/utils/parse';
import DateUtil from '@/utils/date';
import { ChatData, ChatDto, GlobalChatData, GlobalChatDto } from './type';
import Rules from '@/app/shared/rule';

const format = Rules.DATETIME_FORMAT.FULL;

export const ChatConverter = {
  toData(json: ChatDto): ChatData {
    return {
      id: json.id,
      message: json.message,
      createDate: ParseUtil.date(json.createDate),
      updateDate: ParseUtil.date(json.updateDate),
      authorId: json.authorId,
      authorNickname: json.authorNickname,
      isMe: json.isMe,
    };
  },

  toDto(data: ChatData): ChatDto {
    return {
      id: data.id,
      message: data.message,
      createDate: DateUtil.format(data.createDate, { format }),
      updateDate: DateUtil.format(data.updateDate, { format }),
      authorId: data.authorId,
      authorNickname: data.authorNickname,
      isMe: data.isMe,
    };
  },
};

export const GlobalChatConverter = {
  toData(json: GlobalChatDto): GlobalChatData {
    return {
      onlineCount: json.onlineCount,
      chats: json.chats.map((chat) => ChatConverter.toData(chat)),
    };
  },

  toDto(data: GlobalChatData): GlobalChatDto {
    return {
      onlineCount: data.onlineCount,
      chats: data.chats.map((chat) => ChatConverter.toDto(chat)),
    };
  },
};
