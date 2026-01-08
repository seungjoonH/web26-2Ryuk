import { use } from 'react';
import '@/app/page.css';
import RoomPageClient from './client';
import styles from './page.module.css';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  // React.use로 Promise 해제
  const resolvedParams = use(params);

  // TODO: 서버에서 Room 존재하는지 확인 후 처리

  return (
    <RoomPageClient>
      <div className="content">
        <div className={styles.contentWrapper}>
          <h1>Room ID: {resolvedParams.id}</h1>
        </div>
      </div>
    </RoomPageClient>
  );
}
