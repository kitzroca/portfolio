import React from 'react';
import { AboutSectionData } from '../types/portfolio';
import { GithubActivity } from './GithubActivity';

interface AboutProps {
  about: AboutSectionData;
  onNavClick: (id: string) => void;
}

export const About: React.FC<AboutProps> = ({ about, onNavClick }) => {
  return (
    <section
      className="content-section"
      id={about.section_id}
      aria-labelledby="heading-about"
    >
      {/* Header row: Icon + Numbered Title on Left, Breadcrumb Link on Right */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-about">
            {about.section_header}
          </h2>
        </div>
        <a
          href="#about"
          className="section-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('about');
          }}
        >
          {about.nav_badge}
        </a>
      </div>

      {/* Horizontal Rule */}
      <div className="section-rule" aria-hidden="true" />

      {/* Two paragraphs of bio text in soft blue (#7fa8e8) */}
      <div className="bio-wrapper">
        {about.bio_paragraphs.map((bioP, idx) => (
          <p key={idx} className="bio-paragraph">
            {bioP}
          </p>
        ))}
      </div>

      {/* 4-Column Stat Bar (Single connected box with internal hairline dividers) */}
      <div className="stats-bar-box" role="region" aria-label="Key Developer Metrics">
        {about.stats.map((stat, idx) => (
          <div key={idx} className="stat-column">
            <div className="stat-value-row">
              <span className="stat-value">{stat.value}</span>
              {stat.has_link && (
                <a
                  href={stat.link}
                  className="stat-link-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View on GitHub"
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                  </svg>
                </a>
              )}
            </div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Activity Pulse Panel */}
      <GithubActivity activity={about.activity} />
    </section>
  );
};
