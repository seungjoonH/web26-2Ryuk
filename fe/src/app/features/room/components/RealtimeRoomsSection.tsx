'use client';

import styles from './realtimeRoomsSection.module.css';
import RoomCard from './card/RoomCard';
import * as IconCircle from '@/app/components/shared/icon/IconCircle';
import * as TextButton from '@/app/components/shared/button/TextButton';
import SearchForm from '@/app/components/shared/form/search/SearchForm';
import { RealtimeRoomsSectionProps } from './type';
import useResponsive from '@/app/hooks/useResponsive';
import CSSUtil from '@/utils/css';

export default function RealtimeRoomsSection({
  rooms,
  onSearch,
  onCreateRoom,
}: RealtimeRoomsSectionProps) {
  const { isDesktop } = useResponsive();
  const headerClassName = CSSUtil.buildCls(styles.headerDesktop, !isDesktop && styles.headerTablet);

  return (
    <div className={styles.realtimeRoomsSection}>
      <div className={headerClassName}>
        <div className={styles.title}>
          <IconCircle.Secondary name="mic" size="medium" />
          <h2 className={styles.titleText}>실시간 대화방</h2>
        </div>
        <div className={styles.actions}>
          <div className={styles.search}>
            <SearchForm placeholder="제목, 내용, 작성자 검색" onSubmit={onSearch} />
          </div>
          <div className={styles.createRoom}>
            <TextButton.Primary
              text="방 만들기"
              size="medium"
              iconName="add"
              onClick={onCreateRoom}
            />
          </div>
        </div>
      </div>
      <div className={styles.grid}>
        {rooms.map((room) => (
          <RoomCard key={room.id} {...room} />
        ))}
      </div>
    </div>
  );
}
