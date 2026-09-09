import React from 'react';

export const MobileNavSkeleton: React.FC = () => {
  return (
    <header className="mobile-top-nav" aria-hidden="true">
      <div className="mobile-nav-container">
        {/* Brand placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="skeleton-shimmer" style={{ width: 8, height: 8, borderRadius: '50%' }} />
          <div className="skeleton-shimmer" style={{ width: 110, height: 16, borderRadius: 4 }} />
        </div>

        {/* Controls placeholder */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="skeleton-shimmer" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          <div className="skeleton-shimmer" style={{ width: 36, height: 36, borderRadius: 8 }} />
        </div>
      </div>
    </header>
  );
};
