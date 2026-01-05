'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './components.module.css';
import CSSUtil from '@/utils/css';

export default function TabNavigation() {
  const pathname = usePathname();
  const isShared = pathname === '/components/shared';
  const isLayout = pathname === '/components/layout';
  const isFeatures = pathname === '/components/features';
  const isSprite = pathname === '/components/sprite';

  const sharedClassName = CSSUtil.buildCls(styles.navLink, isShared && styles.navLinkActive);
  const layoutClassName = CSSUtil.buildCls(styles.navLink, isLayout && styles.navLinkActive);
  const featuresClassName = CSSUtil.buildCls(styles.navLink, isFeatures && styles.navLinkActive);
  const spriteClassName = CSSUtil.buildCls(styles.navLink, isSprite && styles.navLinkActive);

  return (
    <nav className={styles.pageNavigation}>
      <Link href="/components/shared" className={sharedClassName}>
        Shared
      </Link>
      <Link href="/components/layout" className={layoutClassName}>
        Layout
      </Link>
      <Link href="/components/features" className={featuresClassName}>
        Features
      </Link>
      <Link href="/components/sprite" className={spriteClassName}>
        Sprite
      </Link>
    </nav>
  );
}
