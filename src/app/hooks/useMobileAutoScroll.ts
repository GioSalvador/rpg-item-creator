'use client';
import { useEffect, useRef, useState } from 'react';

export function useMobileAutoScroll(trigger: any) {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  const firstRun = useRef(true);

  useEffect(() => {
    if (!isMobile) return;

    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });

    const onScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 20;

      setShowBackToTop(scrollBottom);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [trigger]);

  return { showBackToTop };
}
