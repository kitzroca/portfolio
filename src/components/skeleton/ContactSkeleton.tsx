import React from 'react';

export const ContactSkeleton: React.FC = () => {
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
          style={{ width: 80, height: 22, borderRadius: 9999 }}
        />
      </div>

      <div className="section-rule" style={{ opacity: 0.4 }} />

      {/* Contact Card */}
      <div className="contact-card" style={{ opacity: 0.9 }}>
        <div
          className="skeleton-shimmer"
          style={{ width: '65%', height: 32, borderRadius: 6 }}
        />
        <div
          className="skeleton-shimmer"
          style={{ width: '85%', height: 16, marginTop: 12, borderRadius: 4 }}
        />

        {/* Channels Grid */}
        <div className="contact-channels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 24 }}>
          {[0, 1].map((idx) => (
            <div key={idx} className="channel-box">
              <div
                className="skeleton-shimmer"
                style={{ width: 50, height: 11, borderRadius: 3 }}
              />
              <div
                className="skeleton-shimmer"
                style={{ width: 140, height: 14, marginTop: 6, borderRadius: 4 }}
              />
            </div>
          ))}
        </div>

        {/* Contact Actions Row */}
        <div className="contact-actions-row" style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
          <div
            className="skeleton-shimmer"
            style={{ width: 140, height: 44, borderRadius: 8 }}
          />
          <div
            className="skeleton-shimmer"
            style={{ width: 130, height: 44, borderRadius: 8 }}
          />
        </div>
      </div>
    </section>
  );
};
