import React, { useMemo } from 'react';
import { ActivityData } from '../types/portfolio';

interface GithubActivityProps {
  activity: ActivityData;
}

export const GithubActivity: React.FC<GithubActivityProps> = ({ activity }) => {
  const totalWeeks = activity.matrix[0]?.length || 53;

  // Month labels matching GitHub's 53-week timeline
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
        labels.push({ col: w, label: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }) });
        lastM = m;
      }
    }
    return labels;
  }, [totalWeeks]);

  return (
    <div className="activity-pulse-panel">
      {/* Top Header Row */}
      <div className="activity-panel-header">
        <div className="activity-header-left">
          <span>{activity.title}</span>
          <a
            href={activity.handle_url}
            className="activity-commits-badge"
            target="_blank"
            rel="noopener noreferrer"
            title="View profile on GitHub"
          >
            {activity.commits_count ? `${activity.commits_count} Commits` : 'Live Commits'}
          </a>
        </div>
        <a
          href={activity.handle_url}
          className="activity-handle-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{activity.handle}</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* GitHub Official Activity Card */}
      <div className="github-overview-card">
        {/* Top Section: Heatmap Calendar */}
        <div className="github-calendar-wrap">
          <div className="heatmap-scroll-wrap" tabIndex={0} aria-label="GitHub contribution activity grid">
            <div className="github-calendar-inner">
              {/* Month Labels Row */}
              <div
                className="github-month-row"
                style={{ '--grid-cols': totalWeeks } as React.CSSProperties}
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

                {/* 53 Columns x 7 Rows Grid */}
                <div
                  className="github-contribution-grid"
                  role="grid"
                  style={{ '--grid-cols': totalWeeks } as React.CSSProperties}
                >
                  {Array.from({ length: totalWeeks }).map((_, colIndex) => (
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
                  ))}
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
                    viewBox="0 0 240 160"
                    className="crosshair-svg"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* Vertical Green Axis (Code review - Pull requests) */}
                    <line
                      x1="120"
                      y1="10"
                      x2="120"
                      y2="150"
                      stroke="#2ea043"
                      strokeWidth="2"
                    />

                    {/* Horizontal Right Arm (Center to Issues) */}
                    <line
                      x1="120"
                      y1="80"
                      x2="210"
                      y2="80"
                      stroke="#2ea043"
                      strokeWidth="2"
                    />

                    {/* Active Left Arm (100% Commits Highlight Bar) */}
                    <line
                      x1="120"
                      y1="80"
                      x2="38"
                      y2="80"
                      stroke="#3fb950"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                    {/* Soft Neon Glow around Dot */}
                    <circle
                      cx="38"
                      cy="80"
                      r="7"
                      fill="#2ea043"
                      opacity="0.4"
                    />

                    {/* Dot on Commits end (White filled, bright green stroke) */}
                    <circle
                      cx="38"
                      cy="80"
                      r="4"
                      fill="#ffffff"
                      stroke="#3fb950"
                      strokeWidth="2"
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
    </div>
  );
};
