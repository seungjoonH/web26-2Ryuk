'use client';

import { ChatBubbleProps } from './chat.type';
import Avatar from '@/app/components/shared/profile/Avatar';
import styles from './chatBubble.module.css';
import CSSUtil from '@/utils/css';
import DateUtil from '@/utils/date';
import Rules from '@/app/shared/rule';

function ChatBubble({
  id,
  authorId,
  authorNickname,
  message,
  createDate,
  updateDate,
  isMe,
}: ChatBubbleProps) {
  const className = CSSUtil.buildCls(styles.chatBubble, isMe && styles.isMe);
  const isEdited = updateDate && updateDate.getTime() !== createDate.getTime();
  const time = DateUtil.format(createDate, { format: Rules.DATETIME_FORMAT.TIME });
  const displayAuthor = isMe ? '나' : authorNickname;

  return (
    <div className={className} data-chat-id={id} data-author-id={authorId}>
      <div className={styles.avatar}>
        <Avatar profileImage="" />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{displayAuthor}</span>
          <span className={styles.time}>
            {time}
            {isEdited && <span className={styles.edited}> (수정됨)</span>}
          </span>
        </div>
        <div className={styles.messageBubble}>
          <div className={styles.message}>{message}</div>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
