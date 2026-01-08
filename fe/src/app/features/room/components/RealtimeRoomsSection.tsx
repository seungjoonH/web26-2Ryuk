'use client';

import { useState } from 'react';
import styles from './realtimeRoomsSection.module.css';
import RoomCard from './card/RoomCard';
import * as IconCircle from '@/app/components/shared/icon/IconCircle';
import * as TextButton from '@/app/components/shared/button/TextButton';
import SearchForm from '@/app/components/shared/form/search/SearchForm';
import { RealtimeRoomsSectionProps } from './type';
import { RoomCreationData, RoomCreationDto } from '../dtos/type';
import useResponsive from '@/app/hooks/useResponsive';
import CSSUtil from '@/utils/css';
import RoomCreationModal from './creation/RoomCreationModal';
import roomService from '../services/RoomService';
import useNavigation from '@/app/hooks/useNavigation';

export default function RealtimeRoomsSection({
  rooms,
  onSearch,
}: Omit<RealtimeRoomsSectionProps, 'onCreateRoom'>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isDesktop } = useResponsive();
  const router = useNavigation();
  const headerClassName = CSSUtil.buildCls(styles.headerDesktop, !isDesktop && styles.headerTablet);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (data: RoomCreationData) => {
    try {
      const roomDto: RoomCreationDto = {
        title: data.title,
        tags: data.tags,
        max_participants: data.maxParticipants,
        is_mic_available: data.isMicAvailable,
        is_private: data.isPrivate,
        password: data.password,
      };

      const response = await roomService.createRoom(roomDto);
      if (response.success && response.data?.id) {
        const newRoomId = response.data.id;
        handleCloseModal();
        router.goToRoom(newRoomId);
      } else {
        // TODO: 방 생성 실패 처리 수정
        alert(`방 생성 실패: ${response.message}`);
      }
    } catch (error) {
      // TODO: 방 생성 오류 처리 수정
      alert('방 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
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
                onClick={handleOpenModal}
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
      {isModalOpen && <RoomCreationModal onCancel={handleCloseModal} onSubmit={handleSubmit} />}
    </>
  );
}
