import styles from '@/app/components/helpers/components.module.css';
import TableOfContents from '@/app/components/helpers/TableOfContents';
import TabNavigation from '@/app/components/helpers/TabNavigation';
import { featureSections } from '@/app/components/helpers/type';
import FeatureComponents from './Feature';

export default async function FeatureComponentsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Components</h1>
        <p className={styles.subtitle}>Design system and feature components showcase.</p>
      </header>
      <TabNavigation />
      <div className={styles.contentWithToc}>
        <FeatureComponents />
        <TableOfContents sections={featureSections} />
      </div>
    </div>
  );
}
