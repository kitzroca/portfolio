import React, { useMemo, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ActivityData } from '../types/portfolio';
import { ActivityPulseSkeleton } from './skeleton/ActivityPulseSkeleton';

interface GithubActivityProps {
  activity: ActivityData;
}

export const GithubActivity: React.FC<GithubActivityProps> = ({ activity }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heatmapScrollRef = useRef<HTMLDivElement>(null);
  const totalWeeks = activity.matrix[0]?.length || 53;

  // Responsive device & view detection
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  // On mobile (< 768px), default to 6 Months so recent active commits are 100% visible without scrolling.
  // On desktop, default to Full Year (53 weeks).
  const [viewRange, setViewRange] = React.useState<'6m' | '1y'>(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 768 ? '1y' : '6m';
  });

  const isResponsive = viewRange === '6m';
  const visibleWeeks = isResponsive ? 26 : totalWeeks;
  const startCol = totalWeeks - visibleWeeks;

  // Handle window resizing
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // When viewing full year, scroll heatmap to the right so recent commits are visible
  useEffect(() => {
    if (viewRange !== '1y') return;
    const el = heatmapScrollRef.current;
    if (!el) return;

    const scrollToEnd = () => {
      if (el) {
        const maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll > 0) {
          el.scrollLeft = maxScroll;
          try {
            el.scrollTo({ left: maxScroll, behavior: 'auto' });
          } catch {}
        }
      }
    };

    scrollToEnd();
    const r1 = requestAnimationFrame(scrollToEnd);
    const t1 = setTimeout(scrollToEnd, 60);
    const t2 = setTimeout(scrollToEnd, 250);

    return () => {
      cancelAnimationFrame(r1);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [viewRange, activity.matrix]);

  // Scroll-linked motion hooks - called unconditionally on every render
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const scrollScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.6], [0.4, 1]);
  const scrollYOffset = useTransform(scrollYProgress, [0, 1], [18, 0]);

  // Month labels matching GitHub's timeline - called unconditionally on every render
  const monthLabels = useMemo(() => {
    const today = new Date();
    const dayOfWeek = today.getUTCDay();
    const startDate = new Date(today);
    startDate.setUTCDate(today.getUTCDate() - (dayOfWeek + (totalWeeks - 1) * 7));

    const labels: Array<{ col: number; label: string }> = [];
    let lastM = -1;

    for (let w = 0; w < totalWeeks; w++) {
      const d = new Date(startDate);
      d.setUTCDate(startDate.getUTCDate() + w * 7);
      const m = d.getUTCMonth();
      if (m !== lastM && w < totalWeeks - 1) {
        if (w >= startCol) {
          labels.push({
            col: w - startCol,
            label: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
          });
        }
        lastM = m;
      }
    }

    // If first visible label starts after column 2, prepend the initial month
    if (labels.length > 0 && labels[0].col > 2) {
      const firstDate = new Date(startDate);
      firstDate.setUTCDate(startDate.getUTCDate() + startCol * 7);
      labels.unshift({
        col: 0,
        label: firstDate.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }),
      });
    }

    return labels;
  }, [totalWeeks, visibleWeeks, startCol]);

  // If live GitHub activity is still loading (e.g. slow connection), show structured skeleton
  if (activity.is_loading) {
    return (
      <div ref={containerRef} style={{ width: '100%' }}>
        <ActivityPulseSkeleton />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <motion.div
        className="activity-pulse-panel"
        style={{
          scale: isMobile ? 1 : scrollScale,
          opacity: isMobile ? 1 : scrollOpacity,
          y: isMobile ? 0 : scrollYOffset,
        }}
      >
        {/* Top Header Row */}
        <div className="activity-panel-header">
          <div className="activity-header-left">
            <span>{activity.title}</span>
            <motion.a
              href={activity.handle_url}
              className="activity-commits-badge"
              target="_blank"
              rel="noopener noreferrer"
              title="View profile on GitHub"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {activity.commits_count ? `${activity.commits_count} Commits` : 'Live Commits'}
            </motion.a>
          </div>
          <motion.a
            href={activity.handle_url}
            className="activity-handle-link"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 2 }}
          >
            <span>{activity.handle}</span>
            <span aria-hidden="true">↗</span>
          </motion.a>
        </div>

        {/* Error/Notice Banner for failed or rate-limited requests */}
        {activity.error && (
          <div className="activity-error-panel" role="alert" style={{ marginBottom: 12 }}>
            <span className="activity-error-text">
              {activity.error}
            </span>
            {activity.onRetry && (
              <button
                type="button"
                className="btn-activity-retry"
                onClick={activity.onRetry}
                aria-label="Retry syncing live GitHub data"
              >
                <span>↺</span> Retry Sync
              </button>
            )}
          </div>
        )}

        {/* GitHub Official Activity Card */}
        <div className="github-overview-card">
          {/* Top Section: Heatmap Calendar */}
          <div className="github-calendar-wrap">
            <div className="calendar-controls-bar">
              <div className="calendar-view-toggle" role="group" aria-label="Activity period">
                <button
                  type="button"
                  className={`cal-toggle-btn ${viewRange === '6m' ? 'active' : ''}`}
                  onClick={() => setViewRange('6m')}
                  aria-pressed={viewRange === '6m'}
                >
                  Recent (6M)
                </button>
                <button
                  type="button"
                  className={`cal-toggle-btn ${viewRange === '1y' ? 'active' : ''}`}
                  onClick={() => setViewRange('1y')}
                  aria-pressed={viewRange === '1y'}
                >
                  Full Year (1Y)
                </button>
              </div>

              {viewRange === '1y' && (
                <div className="heatmap-mobile-swipe-hint" aria-hidden="true">
                  <span>← Swipe for past history</span>
                </div>
              )}
            </div>

            <div
              ref={heatmapScrollRef}
              className={`heatmap-scroll-wrap ${isResponsive ? 'is-responsive' : ''}`}
              tabIndex={0}
              aria-label="GitHub contribution activity grid"
            >
              <div className={`github-calendar-inner ${isResponsive ? 'is-responsive' : ''}`}>
                {/* Month Labels Row */}
                <div
                  className="github-month-row"
                  style={{ '--grid-cols': visibleWeeks } as React.CSSProperties}
                >
                  <div className="day-label-spacer" aria-hidden="true" />
                  <div className="months-track">
                    {monthLabels.map((m, idx) => (
                      <span
                        key={idx}
                        className="github-month-label"
                        style={{
                          gridColumnStart: m.col + 1,
                        }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Day Labels + Grid Body */}
                <div className="github-grid-body">
                  {/* Day Labels Column: Mon, Wed, Fri */}
                  <div className="github-day-labels" aria-hidden="true">
                    <span className="day-label"></span>
                    <span className="day-label">Mon</span>
                    <span className="day-label"></span>
                    <span className="day-label">Wed</span>
                    <span className="day-label"></span>
                    <span className="day-label">Fri</span>
                    <span className="day-label"></span>
                  </div>

                  {/* Grid Columns x 7 Rows (100% Real Live GitHub Data) */}
                  <div
                    className="github-contribution-grid"
                    role="grid"
                    style={{ '--grid-cols': visibleWeeks } as React.CSSProperties}
                  >
                    {Array.from({ length: visibleWeeks }).map((_, i) => {
                      const colIndex = startCol + i;
                      return (
                        <div key={colIndex} className="github-week-column" role="row">
                          {Array.from({ length: 7 }).map((_, rowIndex) => {
                            const lvl = activity.matrix[rowIndex]?.[colIndex] || 0;
                            return (
                              <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`gh-heat-cell gh-lvl-${lvl}`}
                                role="gridcell"
                                title={`Level ${lvl} activity`}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Heatmap Footer: Learn how we count contributions & Legend */}
                <div className="github-heatmap-footer">
                  <a
                    href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-learn-link"
                  >
                    Learn how we count contributions
                  </a>
                  <div className="github-legend">
                    <span className="legend-label">Less</span>
                    <span className="gh-legend-cell gh-lvl-0" />
                    <span className="gh-legend-cell gh-lvl-1" />
                    <span className="gh-legend-cell gh-lvl-2" />
                    <span className="gh-legend-cell gh-lvl-3" />
                    <span className="gh-legend-cell gh-lvl-4" />
                    <span className="legend-label">More</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Border Divider */}
          <div className="github-card-divider" aria-hidden="true" />

          {/* Bottom Section: Activity overview & Crosshair Activity Chart */}
          <div className="github-overview-bottom">
            {/* Left Column: Activity overview */}
            <div className="github-overview-left">
              <h3 className="github-overview-heading">Activity overview</h3>
            </div>

            {/* Vertical Hairline Divider between Left and Chart */}
            <div className="github-overview-vdivider" aria-hidden="true" />

            {/* Right Column: GitHub Crosshair Activity Overview Diagram */}
            <div className="github-overview-right">
              <div className="crosshair-container">
                {/* Top Axis: Code review */}
                <div className="crosshair-label top">Code review</div>

                {/* Center Crosshair Area */}
                <div className="crosshair-center">
                  {/* Left Axis Label: 100% Commits */}
                  <div className="crosshair-label left">
                    <span className="commits-pct">100%</span>
                    <span className="commits-text">Commits</span>
                  </div>

                  {/* SVG Crosshair Lines + Highlight Bar + Glowing Dot */}
                  <div className="crosshair-svg-wrap">
                    <svg
                      viewBox="0 0 240 170"
                      className="crosshair-svg"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {/* Full Continuous Horizontal Green Axis (Commits to Issues) */}
                      <line
                        x1="45"
                        y1="85"
                        x2="195"
                        y2="85"
                        stroke="#238636"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Full Continuous Vertical Green Axis (Code review to Pull requests) */}
                      <line
                        x1="120"
                        y1="10"
                        x2="120"
                        y2="160"
                        stroke="#238636"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Center Crosshair Intersection Node */}
                      <circle
                        cx="120"
                        cy="85"
                        r="3"
                        fill="#238636"
                      />

                      {/* Active Left Arm: 100% Commits Highlight Bar (Solid, vivid green, fully visible) */}
                      <line
                        x1="120"
                        y1="85"
                        x2="45"
                        y2="85"
                        stroke="#39d353"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Soft Neon Glow around Commits Dot with subtle breathe animation */}
                      <motion.circle
                        cx="45"
                        cy="85"
                        r="8"
                        fill="#39d353"
                        animate={{
                          scale: [1, 1.25, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />

                      {/* Dot on Commits end (White core, bright green border) */}
                      <circle
                        cx="45"
                        cy="85"
                        r="4.5"
                        fill="#ffffff"
                        stroke="#39d353"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>

                  {/* Right Axis Label: Issues */}
                  <div className="crosshair-label right">Issues</div>
                </div>

                {/* Bottom Axis: Pull requests */}
                <div className="crosshair-label bottom">Pull requests</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
