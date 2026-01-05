'use client';

import { GhostTextButton } from './TextButton';
import { GhostIconButton } from '../icon/IconButton';
import useNavigation from '@/app/hooks/useNavigation';
import useResponsive from '@/app/hooks/useResponsive';

export default function GoBackButton() {
  const { goBack } = useNavigation();
  const { isDesktop } = useResponsive();

  return isDesktop ? (
    <GhostTextButton iconName="left" text="돌아가기" size="medium" onClick={goBack} />
  ) : (
    <GhostIconButton name="left" size="medium" onClick={goBack} />
  );
}
