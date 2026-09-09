import React, { useRef, useEffect } from 'react';

export const ActivityPulseSkeleton: React.FC = () => {
  const totalWeeks = 53;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div style={{ width: '100%' }} aria-hidden="true">
      <div className="activity-pulse-panel" style={{ opacity: 0.9 }}>
        {/* Top Header Row */}
        <div className="activity-panel-header">
          <div className="activity-header-left" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              className="skeleton-shimmer"
              style={{ width: 110, height: 16, borderRadius: 4 }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: 85, height: 22, borderRadius: 9999 }}
            />
          </div>
          <div
            className="skeleton-shimmer"
            style={{ width: 80, height: 16, borderRadius: 4 }}
          />
        </div>

        {/* GitHub Official Activity Card */}
        <div className="github-overview-card">
          {/* Top Section: Heatmap Calendar */}
          <div className="github-calendar-wrap">
            <div ref={scrollRef} className="heatmap-scroll-wrap" tabIndex={-1}>
              <div className="github-calendar-inner">
                {/* Month Labels Row */}
                <div
                  className="github-month-row"
                  style={{ '--grid-cols': totalWeeks } as React.CSSProperties}
                >
                  <div className="day-label-spacer" />
                  <div className="months-track" style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 10 }}>
                    {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((_, i) => (
                      <div
                        key={i}
                        className="skeleton-shimmer"
                        style={{ width: 22, height: 10, borderRadius: 2 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Day Labels + Grid Body */}
                <div className="github-grid-body">
                  <div className="github-day-labels" aria-hidden="true">
                    <span className="day-label"></span>
                    <span className="day-label" style={{ opacity: 0.4 }}>Mon</span>
                    <span className="day-label"></span>
                    <span className="day-label" style={{ opacity: 0.4 }}>Wed</span>
                    <span className="day-label"></span>
                    <span className="day-label" style={{ opacity: 0.4 }}>Fri</span>
                    <span className="day-label"></span>
                  </div>

                  {/* 53 Columns x 7 Rows Grid Shimmer */}
                  <div
                    className="github-contribution-grid"
                    style={{ '--grid-cols': totalWeeks } as React.CSSProperties}
                  >
                    {Array.from({ length: totalWeeks }).map((_, colIndex) => (
                      <div key={colIndex} className="github-week-column">
                        {Array.from({ length: 7 }).map((_, rowIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className="gh-heat-cell skeleton-shimmer"
                            style={{
                              animationDelay: `${(colIndex * 0.02 + rowIndex * 0.05).toFixed(2)}s`,
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Heatmap Footer */}
                <div className="github-heatmap-footer">
                  <div
                    className="skeleton-shimmer"
                    style={{ width: 170, height: 11, borderRadius: 3 }}
                  />
                  <div className="github-legend" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="legend-label" style={{ opacity: 0.4 }}>Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                      <span
                        key={l}
                        className="gh-legend-cell skeleton-shimmer"
                        style={{ width: 10, height: 10, borderRadius: 2 }}
                      />
                    ))}
                    <span className="legend-label" style={{ opacity: 0.4 }}>More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Border Divider */}
          <div className="github-card-divider" />

          {/* Bottom Section: Activity overview & Crosshair Diagram Skeleton */}
          <div className="github-overview-bottom">
            <div className="github-overview-left">
              <div
                className="skeleton-shimmer"
                style={{ width: 130, height: 16, borderRadius: 4 }}
              />
            </div>

            <div className="github-overview-vdivider" />

            <div className="github-overview-right">
              <div className="crosshair-container" style={{ opacity: 0.7 }}>
                <div
                  className="skeleton-shimmer"
                  style={{ width: 70, height: 12, margin: '0 auto 6px', borderRadius: 3 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div
                    className="skeleton-shimmer"
                    style={{ width: 55, height: 12, borderRadius: 3 }}
                  />
                  <div
                    className="skeleton-shimmer"
                    style={{ width: 90, height: 60, borderRadius: 6 }}
                  />
                  <div
                    className="skeleton-shimmer"
                    style={{ width: 45, height: 12, borderRadius: 3 }}
                  />
                </div>
                <div
                  className="skeleton-shimmer"
                  style={{ width: 75, height: 12, margin: '6px auto 0', borderRadius: 3 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
