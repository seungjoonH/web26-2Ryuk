import ParseUtil from '@/app/utils/parse';
import DateUtil from '@/app/utils/date';
import { PostData, PostDto, PostListRowData, PostListRowDto } from './type';
import Rules from '@/app/shared/rule';

const format = Rules.DATETIME_FORMAT.FULL;

export const PostConverter = {
  toData(json: PostDto): PostData {
    return {
      id: json.id,
      title: json.title,
      tags: json.tags,
      createDate: ParseUtil.date(json.createDate),
      updateDate: ParseUtil.date(json.updateDate ?? null),
      viewCount: json.viewCount,
      likeCount: json.likeCount,
      commentCount: json.commentCount,
    };
  },

  toDto(data: PostData): PostDto {
    return {
      id: data.id,
      title: data.title,
      tags: data.tags,
      createDate: DateUtil.format(data.createDate, { format }),
      updateDate: DateUtil.format(data.updateDate ?? null, { format }),
      viewCount: data.viewCount,
      likeCount: data.likeCount,
      commentCount: data.commentCount,
    };
  },
};

export const PostListRowConverter = {
  toData(json: PostListRowDto): PostListRowData {
    return {
      id: json.id,
      title: json.title,
      content: json.content,
      createDate: ParseUtil.date(json.createDate),
      updateDate: ParseUtil.date(json.updateDate ?? null),
      authorId: json.authorId,
      authorNickname: json.authorNickname,
      isMe: json.isMe,
      category: json.category,
      viewCount: json.viewCount,
      likeCount: json.likeCount,
      commentCount: json.commentCount,
    };
  },

  toDto(data: PostListRowData): PostListRowDto {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      createDate: DateUtil.format(data.createDate, { format }),
      updateDate: DateUtil.format(data.updateDate ?? null, { format }),
      authorId: data.authorId,
      authorNickname: data.authorNickname,
      isMe: data.isMe,
      category: data.category,
      viewCount: data.viewCount,
      likeCount: data.likeCount,
      commentCount: data.commentCount,
    };
  },
};
