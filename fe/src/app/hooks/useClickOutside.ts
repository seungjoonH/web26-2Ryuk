import { useEffect, RefObject } from 'react';

/**
 * 외부 클릭 감지 훅
 * @param ref 모달 요소의 ref
 * @param callback 외부 클릭 시 실행할 콜백 함수
 * @param enabled 활성화 여부 (기본값: true)
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  callback: () => void,
  enabled: boolean = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      // 모달 내부 클릭이면 처리하지 않음
      if (ref.current && ref.current.contains(event.target as Node)) return;
      // 모달 외부 클릭이면 callback 실행
      callback();
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ref, callback, enabled]);
}
