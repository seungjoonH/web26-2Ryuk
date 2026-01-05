'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './textTooltip.module.css';
import { TextTooltipProps } from './type';
import type { TextTooltipPosition } from './type';
import CSSUtil from '@/utils/css';

export default function TextTooltip({ text, anchorId }: TextTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<TextTooltipPosition>('center');

  useEffect(() => {
    const anchor = document.querySelector(`[data-anchor="${anchorId}"]`);
    if (!anchor || !tooltipRef.current) return;

    const updatePosition = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const tooltipRect = tooltipRef.current!.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // 툴팁이 중앙 정렬되었을 때의 위치 계산
      const tooltipCenterX = anchorRect.left + anchorRect.width / 2;
      const tooltipLeft = tooltipCenterX - tooltipRect.width / 2;
      const tooltipRight = tooltipCenterX + tooltipRect.width / 2;

      // 화면 밖으로 나가는지 확인
      if (tooltipLeft < 0) setPosition('left');
      else if (tooltipRight > viewportWidth) setPosition('right');
      else setPosition('center');
    };

    const handleMouseEnter = () => setTimeout(updatePosition, 0);

    anchor.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      anchor.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [anchorId]);

  const className = CSSUtil.buildCls(styles.tooltip, styles[position]);

  return (
    <div ref={tooltipRef} className={className} data-tooltip={anchorId}>
      {text}
    </div>
  );
}
