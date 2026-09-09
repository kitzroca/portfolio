import React from 'react';
import { motion } from 'framer-motion';
import { AboutSectionData } from '../types/portfolio';
import { GithubActivity } from './GithubActivity';
import {
  fadeInUp,
  fadeInFrom,
  staggerContainer,
  cardVariants,
  VIEWPORT_ONCE,
} from '../utils/motion';

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
      <motion.div
        className="section-header-row"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={fadeInUp(18)}
      >
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-about">
            {about.section_header}
          </h2>
        </div>
        <motion.a
          href="#about"
          className="section-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('about');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {about.nav_badge}
        </motion.a>
      </motion.div>

      {/* Horizontal Rule */}
      <motion.div
        className="section-rule"
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Two paragraphs of bio text: Enters gently from slightly below */}
      <motion.div
        className="bio-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={staggerContainer(0.12, 0.05)}
      >
        {about.bio_paragraphs.map((bioP, idx) => (
          <motion.p key={idx} className="bio-paragraph" variants={fadeInUp(18)}>
            {bioP}
          </motion.p>
        ))}
      </motion.div>

      {/* 4-Column Stat Bar: Visual metrics element enters from opposite direction (slight top/right reveal) */}
      <motion.div
        className="stats-bar-box"
        role="region"
        aria-label="Key Developer Metrics"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={fadeInFrom('top', 16, 0.1)}
      >
        {about.stats.map((stat, idx) => (
          <motion.div
            key={idx}
            className="stat-column"
            variants={cardVariants}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        ))}
      </motion.div>

      {/* Activity Pulse Panel */}
      <GithubActivity activity={about.activity} />
    </section>
  );
};
