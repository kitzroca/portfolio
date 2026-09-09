import React from 'react';

export const VouchSkeleton: React.FC = () => {
  return (
    <section className="content-section" aria-hidden="true">
      {/* Header row */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div
            className="skeleton-shimmer"
            style={{ width: 180, height: 20, borderRadius: 4 }}
          />
        </div>

        <div className="vouch-header-actions" style={{ display: 'flex', gap: 10 }}>
          <div
            className="skeleton-shimmer"
            style={{ width: 105, height: 28, borderRadius: 6 }}
          />
          <div
            className="skeleton-shimmer"
            style={{ width: 75, height: 22, borderRadius: 9999 }}
          />
        </div>
      </div>

      <div className="section-rule" style={{ opacity: 0.4 }} />

      {/* 3-Column Vouch Grid */}
      <div className="vouch-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {[0, 1, 2].map((idx) => (
          <article key={idx} className="vouch-card" style={{ opacity: 0.9 }}>
            <div className="vouch-card-top-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="vouch-quote-mark" style={{ opacity: 0.2 }}>“</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              <div className="skeleton-shimmer" style={{ width: '100%', height: 13, borderRadius: 3 }} />
              <div className="skeleton-shimmer" style={{ width: '92%', height: 13, borderRadius: 3 }} />
              <div className="skeleton-shimmer" style={{ width: '70%', height: 13, borderRadius: 3 }} />
            </div>

            <div className="vouch-author-row" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
              <div
                className="skeleton-shimmer"
                style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  className="skeleton-shimmer"
                  style={{ width: 90, height: 13, borderRadius: 3 }}
                />
                <div
                  className="skeleton-shimmer"
                  style={{ width: 110, height: 11, borderRadius: 3 }}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
