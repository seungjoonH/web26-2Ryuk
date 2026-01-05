import '@/app/page.css';
import GamePageClient from './client';
import { GamePageTitleSection } from '@/app/components/layout/pageTitleSection/PageTitleSection';
import styles from './page.module.css';

export default function GamePage() {
  return (
    <GamePageClient>
      <div className="content">
        <div className={styles.contentWrapper}>
          <GamePageTitleSection />
        </div>
      </div>
    </GamePageClient>
  );
}
