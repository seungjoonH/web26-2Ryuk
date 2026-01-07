'use client';

import { useEffect, useState } from 'react';
import styles from './components.module.css';
import CSSUtil from '@/utils/css';

interface Section {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  sections: Section[];
}

function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 실행

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // 헤더 높이 고려
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const buildClassName = (sectionId: string) =>
    CSSUtil.buildCls(styles.tocLink, activeSection === sectionId && styles.tocLinkActive);

  return (
    <nav className={styles.tableOfContents}>
      <h3 className={styles.tocTitle}>목차</h3>
      <ul className={styles.tocList}>
        {sections.map((section) => (
          <li key={`section-${section.id}`} className={styles.tocItem}>
            <button className={buildClassName(section.id)} onClick={() => handleClick(section.id)}>
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default TableOfContents;
