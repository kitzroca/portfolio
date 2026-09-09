import React from 'react';
import { ActivityPulseSkeleton } from './ActivityPulseSkeleton';

export const AboutSkeleton: React.FC = () => {
  return (
    <section className="content-section" aria-hidden="true">
      {/* Header row */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div
            className="skeleton-shimmer"
            style={{ width: 200, height: 20, borderRadius: 4 }}
          />
        </div>
        <div
          className="skeleton-shimmer"
          style={{ width: 85, height: 22, borderRadius: 9999 }}
        />
      </div>

      {/* Horizontal Rule */}
      <div className="section-rule" style={{ opacity: 0.4 }} />

      {/* Bio paragraphs */}
      <div className="bio-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton-shimmer" style={{ width: '100%', height: 16, borderRadius: 4 }} />
          <div className="skeleton-shimmer" style={{ width: '96%', height: 16, borderRadius: 4 }} />
          <div className="skeleton-shimmer" style={{ width: '78%', height: 16, borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="skeleton-shimmer" style={{ width: '98%', height: 16, borderRadius: 4 }} />
          <div className="skeleton-shimmer" style={{ width: '64%', height: 16, borderRadius: 4 }} />
        </div>
      </div>

      {/* 4-Column Stat Bar */}
      <div className="stats-bar-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} className="stat-column">
            <div className="stat-value-row">
              <div
                className="skeleton-shimmer"
                style={{ width: 64, height: 30, borderRadius: 6 }}
              />
            </div>
            <div
              className="skeleton-shimmer"
              style={{ width: 90, height: 11, marginTop: 8, borderRadius: 3 }}
            />
          </div>
        ))}
      </div>

      {/* Activity Pulse Panel Skeleton */}
      <ActivityPulseSkeleton />
    </section>
  );
};
