import React from 'react';

export const TechStackSkeleton: React.FC = () => {
  return (
    <section className="content-section" aria-hidden="true">
      {/* Header row */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div
            className="skeleton-shimmer"
            style={{ width: 160, height: 20, borderRadius: 4 }}
          />
        </div>
        <div
          className="skeleton-shimmer"
          style={{ width: 85, height: 22, borderRadius: 9999 }}
        />
      </div>

      <div className="section-rule" style={{ opacity: 0.4 }} />

      {/* Stack Grid: 3 Categories */}
      <div className="stack-grid" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          { titleWidth: 120, count: 6 },
          { titleWidth: 140, count: 5 },
          { titleWidth: 160, count: 5 },
        ].map((cat, idx) => (
          <div key={idx} className="stack-category-card" style={{ opacity: 0.9 }}>
            <div className="stack-category-header" style={{ marginBottom: 14 }}>
              <div
                className="skeleton-shimmer"
                style={{ width: cat.titleWidth, height: 16, borderRadius: 4 }}
              />
            </div>

            <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
              {Array.from({ length: cat.count }).map((_, sIdx) => (
                <div
                  key={sIdx}
                  className="tech-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                  }}
                >
                  <div
                    className="skeleton-shimmer"
                    style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0 }}
                  />
                  <div
                    className="skeleton-shimmer"
                    style={{ width: 60, height: 13, borderRadius: 3 }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
