import React from 'react';

export const HeroSkeleton: React.FC = () => {
  return (
    <aside className="sidebar" aria-hidden="true">
      <div className="sidebar-scrollable">
        {/* Profile Header */}
        <header className="profile-header">
          {/* Avatar + Status/Location row */}
          <div className="profile-top-row">
            <div
              className="avatar-wrapper skeleton-shimmer"
              style={{
                width: 76,
                height: 76,
                borderRadius: 'var(--card-radius-sm, 10px)',
                flexShrink: 0,
              }}
            />

            <div className="profile-side-info" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Hire badge */}
              <div
                className="skeleton-shimmer"
                style={{ width: 125, height: 22, borderRadius: 9999 }}
              />
              {/* Location */}
              <div
                className="skeleton-shimmer"
                style={{ width: 145, height: 13, borderRadius: 4 }}
              />
            </div>
          </div>

          {/* Name & Role */}
          <div
            className="skeleton-shimmer"
            style={{ width: 190, height: 32, marginTop: 22, borderRadius: 6 }}
          />
          <div
            className="skeleton-shimmer"
            style={{ width: 220, height: 14, marginTop: 12, borderRadius: 4 }}
          />

          {/* Summary Tagline */}
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div
              className="skeleton-shimmer"
              style={{ width: '100%', height: 14, borderRadius: 4 }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: '84%', height: 14, borderRadius: 4 }}
            />
          </div>
        </header>

        {/* Vertical Nav List Skeleton */}
        <nav className="sidebar-nav" style={{ marginTop: 36 }}>
          <ul className="nav-list" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[140, 150, 130, 135, 145].map((width, idx) => (
              <li key={idx} className="nav-item">
                <div
                  className="skeleton-shimmer"
                  style={{ width, height: 20, borderRadius: 4 }}
                />
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sidebar Footer Skeleton */}
      <footer className="sidebar-footer">
        <div className="footer-actions-row">
          {/* Social Icons Group */}
          <div className="social-links-group" style={{ display: 'flex', gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="skeleton-shimmer"
                style={{ width: 36, height: 36, borderRadius: '50%' }}
              />
            ))}
          </div>

          {/* Right Actions: Resume Button & Theme Toggle */}
          <div className="footer-right-actions" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div
              className="skeleton-shimmer"
              style={{ width: 95, height: 36, borderRadius: 8 }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: 36, height: 36, borderRadius: '50%' }}
            />
          </div>
        </div>

        {/* Copyright Notice */}
        <div
          className="skeleton-shimmer"
          style={{ width: 190, height: 12, marginTop: 16, borderRadius: 4 }}
        />
      </footer>
    </aside>
  );
};
