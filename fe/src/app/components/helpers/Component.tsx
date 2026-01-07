'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import styles from './components.module.css';

interface ComponentProps {
  children: ReactNode;
  fullWidth?: boolean;
}

function Component({ children, fullWidth = false }: ComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const className = fullWidth ? `${styles.component} ${styles.fullWidth}` : styles.component;

  return (
    <div ref={containerRef} className={className}>
      {children}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <div className={styles.dimensionLabel}>
          {dimensions.width} × {dimensions.height}px
        </div>
      )}
    </div>
  );
}

export default Component;
