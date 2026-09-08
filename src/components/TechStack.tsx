import React from 'react';
import { StackSectionData, StackSkillItem } from '../types/portfolio';

interface TechStackProps {
  stack: StackSectionData;
  onNavClick: (id: string) => void;
}

export const TechStack: React.FC<TechStackProps> = ({ stack, onNavClick }) => {
  return (
    <section
      className="content-section"
      id={stack.section_id}
      aria-labelledby="heading-stack"
    >
      <div className="section-header-row">
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-stack">
            {stack.section_header}
          </h2>
        </div>
        <a
          href="#stack"
          className="section-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('stack');
          }}
        >
          {stack.nav_badge}
        </a>
      </div>

      <div className="section-rule" aria-hidden="true" />

      <div className="stack-grid">
        {stack.categories.map((cat, idx) => (
          <div key={idx} className="stack-category-card">
            <div className="stack-category-header">
              <h3 className="stack-category-title">{cat.title}</h3>
            </div>

            <div className="tech-items-grid" role="list">
              {cat.skills.map((skill, sIdx) => {
                const isObj = typeof skill === 'object' && skill !== null;
                const item: StackSkillItem = isObj
                  ? (skill as StackSkillItem)
                  : { name: skill as string, icon: `/icons/${(skill as string).toLowerCase().replace(/[^a-z0-9]/g, '')}.svg` };

                return (
                  <div
                    key={sIdx}
                    className="tech-card"
                    role="listitem"
                    title={item.description ? `${item.name}: ${item.description}` : item.name}
                  >
                    <div className="tech-icon-container" aria-hidden="true">
                      <img
                        src={item.icon}
                        alt={`${item.name} logo`}
                        className="tech-icon-img"
                        loading="lazy"
                        width="32"
                        height="32"
                        onError={(e) => {
                          // Clean fallback in case of loading anomaly
                          const target = e.currentTarget;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="tech-info">
                      <h4 className="tech-name">{item.name}</h4>
                      {item.description && (
                        <p className="tech-desc">{item.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
