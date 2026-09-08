import React from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

export const ScrollProgress: React.FC = () => {
  const progress = useScrollProgress();

  return (
    <div
      className="top-accent-bar"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
};
