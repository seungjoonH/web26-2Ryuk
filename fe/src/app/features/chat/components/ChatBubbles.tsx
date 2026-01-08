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
          message={chat.message}
          sender={chat.sender}
          timestamp={chat.timestamp}
        />
      ))}
    </div>
  );
}

export default ChatBubbles;
