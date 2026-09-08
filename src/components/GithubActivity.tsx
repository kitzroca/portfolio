import React from 'react';
import { ActivityData } from '../types/portfolio';

interface GithubActivityProps {
  activity: ActivityData;
}

export const GithubActivity: React.FC<GithubActivityProps> = ({ activity }) => {
  return (
    <div className="activity-pulse-panel">
      <div className="activity-panel-header">
        <div className="activity-header-left">
          <span>{activity.title}</span>
          {activity.commits_count !== undefined && (
            <span className="activity-commits-badge">
              {activity.commits_count} {Number(activity.commits_count) === 1 ? 'Commit' : 'Commits'}
            </span>
          )}
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

      {/* Heatmap Card (28 cols x 4 rows, progress bar, monospace footer stats) */}
      <div className="activity-card">
        <div
          className="heatmap-scroll-wrap"
          tabIndex={0}
          aria-label="GitHub contribution activity grid"
        >
          <div
            className="heatmap-grid"
            role="grid"
            style={
              {
                '--heatmap-cols': activity.matrix[0]?.length || 52,
              } as React.CSSProperties
            }
          >
            {activity.matrix.map((row, rowIndex) =>
              row.map((lvl, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`heat-cell heat-lvl-${lvl}`}
                  title={`Week ${colIndex + 1}, Row ${rowIndex + 1}: ${
                    lvl > 0 ? `Contributed (level ${lvl})` : 'No contributions'
                  }`}
                  role="gridcell"
                  aria-label={`Contribution level ${lvl}`}
                />
              ))
            )}
          </div>
        </div>

        {/* Thin Progress Bar */}
        <div className="activity-progress-bar-wrap" aria-hidden="true">
          <div
            className="activity-progress-bar-fill"
            style={{ width: `${Math.min(Math.max(activity.progress, 0), 100)}%` }}
          />
        </div>

        {/* Footer Stats Row */}
        <div className="activity-footer-stats">
          {activity.stats.map((item) => (
            <div key={item.key} className="activity-stat-item">
              <span className="activity-stat-key">{item.key}:</span>
              <span className="activity-stat-val">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
