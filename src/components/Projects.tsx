import React from 'react';
import { ProjectsSectionData } from '../types/portfolio';

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
      <div className="section-header-row">
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-projects">
            {projects.section_header}
          </h2>
        </div>
        <a
          href="#projects"
          className="section-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('projects');
          }}
        >
          {projects.nav_badge}
        </a>
      </div>

      <div className="section-rule" aria-hidden="true" />

      <div className="projects-list">
        {projects.items.map((project, idx) => {
          // const hasLive = project.live_url && project.live_url !== '#';
          // const hasGithub =
          //   project.github_url &&
          //   project.github_url !== '#' &&
          //   project.github_url !== '';

          return (
            <article
              key={idx}
              className="project-card"
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

              {/* Action buttons (shown if URLs exist) */}
              {/* {(hasLive || hasGithub) && (
                <div className="project-actions-row">
                  {hasLive && (
                    <a
                      href={project.live_url}
                      className="project-action-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Live Demo</span>
                      <svg viewBox="0 0 24 24">
                        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                      </svg>
                    </a>
                  )}
                  {hasGithub && (
                    <a
                      href={project.github_url}
                      className="project-action-link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>Source Code</span>
                      <svg viewBox="0 0 24 24">
                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                      </svg>
                    </a>
                  )}
                </div>
              )} */}
            </article>
          );
        })}
      </div>
    </section>
  );
};
