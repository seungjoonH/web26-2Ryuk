'use client';

import { FormEvent, useState } from 'react';
import { PrimaryTextfield } from '@/app/components/shared/textfield/Textfield';
import { PrimaryIconButton } from '@/app/components/shared/icon/IconButton';
import styles from './messageForm.module.css';

interface MessageFormProps {
  placeholder?: string;
  onSubmit?: (message: string) => void;
  disabled?: boolean;
}

export default function MessageForm({
  placeholder = 'MessageForm',
  onSubmit,
  disabled = false,
}: MessageFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;
    onSubmit?.(message.trim());
    setMessage('');
  };

  const handleSendClick = () => {
    if (!message.trim() || disabled) return;
    onSubmit?.(message.trim());
    setMessage('');
  };

  return (
    <form className={styles.messageForm} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <PrimaryTextfield
          placeholder={placeholder}
          initialValue={message}
          value={message}
          onChange={setMessage}
          disabled={disabled}
        />
      </div>
      <PrimaryIconButton
        name="send"
        size="medium"
        onClick={handleSendClick}
        disabled={disabled || !message.trim()}
      />
    </form>
  );
}
