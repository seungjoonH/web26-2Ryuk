'use client';

import ChatBubble from './ChatBubble';
import styles from './chat.module.css';
import { ChatBubblesProps } from './type';

function ChatBubbles({ chats }: ChatBubblesProps) {
  return (
    <div className={styles.chatBubbles}>
      {chats.map((chat) => (
        <ChatBubble
          key={`chatBubble-${chat.id}`}
          id={chat.id}
          authorId={chat.authorId}
          authorNickname={chat.authorNickname}
          message={chat.message}
          createDate={chat.createDate}
          isMe={chat.isMe}
        />
      ))}
    </div>
  );
}

export default ChatBubbles;
