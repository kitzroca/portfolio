import React from 'react';
import { useBackToTop } from '../hooks/useBackToTop';

export const BackToTop: React.FC = () => {
  const { isVisible, scrollToTop } = useBackToTop();

  return (
    <button
      type="button"
      className={`back-to-top-btn ${isVisible ? 'visible' : ''}`}
      id="back-to-top-btn"
      style={{ borderRadius: '50%' }}
      aria-label="Back to top of page"
      onClick={scrollToTop}
    >
      <svg
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};
