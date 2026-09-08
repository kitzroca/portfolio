import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds: string[], defaultId: string = 'about') {
  const [activeId, setActiveId] = useState<string>(defaultId);

  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id) {
            setActiveId(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    });

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      if (window.scrollY < 50 && sectionIds.length > 0) {
        setActiveId(sectionIds[0]);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds]);

  return activeId;
}
