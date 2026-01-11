'use client';

import { useEffect, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { modalStore } from './modal.store';
import styles from './modal.module.css';

export function useModal() {
  const openModal = modalStore((state) => state.openModal);
  const closeModal = modalStore((state) => state.closeModal);
  const isOpen = modalStore((state) => state.isOpen);

  return { openModal, closeModal, isOpen };
}

interface ModalProps {
  id: string;
  children: ReactNode;
}

export default function Modal({ id, children }: ModalProps) {
  const openModals = modalStore((state) => state.openModals);
  const closeModal = modalStore((state) => state.closeModal);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isOpen = openModals.has(id);
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal(id);
    }
  };

  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return createPortal(
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.content} onClick={handleContentClick}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
