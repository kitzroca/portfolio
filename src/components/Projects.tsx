import React from 'react';
import { motion } from 'framer-motion';
import { ProjectsSectionData } from '../types/portfolio';
import {
  fadeInUp,
  projectCardSlide,
  VIEWPORT_ONCE,
} from '../utils/motion';

interface ProjectsProps {
  projects: ProjectsSectionData;
  onNavClick: (id: string) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, onNavClick }) => {
  return (
    <section
      className="content-section"
      id={projects.section_id}
      aria-labelledby="heading-projects"
    >
      <motion.div
        className="section-header-row"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={fadeInUp(18)}
      >
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-projects">
            {projects.section_header}
          </h2>
        </div>
        <motion.a
          href="#projects"
          className="section-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('projects');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {projects.nav_badge}
        </motion.a>
      </motion.div>

      <motion.div
        className="section-rule"
        aria-hidden="true"
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={VIEWPORT_ONCE}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      <div className="projects-list">
        {projects.items.map((project, idx) => (
          /* Dynamic alternating horizontal + vertical motion (left slide vs right slide) */
          <motion.article
            key={idx}
            className="project-card"
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT_ONCE}
            variants={projectCardSlide(idx)}
            whileHover={{ y: -4, scale: 1.008 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="project-card-header">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-meta-badges">
                <span className="badge-tag highlight">{project.badge}</span>
                <span className="badge-tag">{project.period}</span>
              </div>
            </div>

            <p className="project-description">{project.description}</p>

            <div className="project-stats-line">
              <span>{project.stats}</span>
            </div>

            <div className="project-tech-row" aria-label="Technologies used">
              {project.tech.map((t, tIdx) => (
                <span key={tIdx} className="tech-pill">
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};
