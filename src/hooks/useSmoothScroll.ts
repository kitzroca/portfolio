import { useCallback } from 'react';

export function useSmoothScroll() {
  const scrollTo = useCallback((targetId: string) => {
    if (!targetId || targetId === '#') return;
    const cleanId = targetId.startsWith('#') ? targetId.slice(1) : targetId;
    const targetElement = document.getElementById(cleanId);

    if (targetElement) {
      const isMobile = window.innerWidth <= 980;
      const offset = isMobile ? 74 : 32;

      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetElement.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      if (history.pushState) {
        history.pushState(null, '', `#${cleanId}`);
      }
    }
  }, []);

  return scrollTo;
}
