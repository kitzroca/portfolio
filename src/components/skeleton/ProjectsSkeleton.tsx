import React from 'react';

export const ProjectsSkeleton: React.FC = () => {
  return (
    <section className="content-section" aria-hidden="true">
      {/* Header row */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div
            className="skeleton-shimmer"
            style={{ width: 170, height: 20, borderRadius: 4 }}
          />
        </div>
        <div
          className="skeleton-shimmer"
          style={{ width: 100, height: 22, borderRadius: 9999 }}
        />
      </div>

      <div className="section-rule" style={{ opacity: 0.4 }} />

      {/* Projects List */}
      <div className="projects-list" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {[0, 1, 2].map((idx) => (
          <article key={idx} className="project-card" style={{ opacity: 0.9 }}>
            <div className="project-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                className="skeleton-shimmer"
                style={{ width: idx === 0 ? 180 : idx === 1 ? 140 : 160, height: 24, borderRadius: 4 }}
              />
              <div className="project-meta-badges" style={{ display: 'flex', gap: 8 }}>
                <div
                  className="skeleton-shimmer"
                  style={{ width: 70, height: 20, borderRadius: 9999 }}
                />
                <div
                  className="skeleton-shimmer"
                  style={{ width: 55, height: 20, borderRadius: 9999 }}
                />
              </div>
            </div>

            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton-shimmer" style={{ width: '100%', height: 14, borderRadius: 4 }} />
              <div className="skeleton-shimmer" style={{ width: '85%', height: 14, borderRadius: 4 }} />
            </div>

            <div className="project-stats-line" style={{ marginTop: 14 }}>
              <div
                className="skeleton-shimmer"
                style={{ width: 130, height: 12, borderRadius: 3 }}
              />
            </div>

            <div className="project-tech-row" style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[60, 50, 65, 55].map((w, tIdx) => (
                <div
                  key={tIdx}
                  className="skeleton-shimmer"
                  style={{ width: w, height: 22, borderRadius: 4 }}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
