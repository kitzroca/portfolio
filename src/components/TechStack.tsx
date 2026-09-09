import React from 'react';
import { motion } from 'framer-motion';
import { StackSectionData, StackSkillItem } from '../types/portfolio';
import { fadeInUp, staggerContainer, cardVariants, VIEWPORT_ONCE } from '../utils/motion';

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
      <motion.div
        className="section-header-row"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={fadeInUp(18)}
      >
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-stack">
            {stack.section_header}
          </h2>
        </div>
        <motion.a
          href="#stack"
          className="section-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('stack');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {stack.nav_badge}
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

      <motion.div
        className="stack-grid"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={staggerContainer(0.12, 0.05)}
      >
        {stack.categories.map((cat, idx) => (
          <motion.div
            key={idx}
            className="stack-category-card"
            variants={cardVariants}
          >
            <div className="stack-category-header">
              <h3 className="stack-category-title">{cat.title}</h3>
            </div>

            <motion.div
              className="tech-items-grid"
              role="list"
              variants={staggerContainer(0.04, 0.05)}
            >
              {cat.skills.map((skill, sIdx) => {
                const isObj = typeof skill === 'object' && skill !== null;
                const item: StackSkillItem = isObj
                  ? (skill as StackSkillItem)
                  : { name: skill as string, icon: `/icons/${(skill as string).toLowerCase().replace(/[^a-z0-9]/g, '')}.svg` };

                return (
                  <motion.div
                    key={sIdx}
                    className="tech-card"
                    role="listitem"
                    title={item.description ? `${item.name}: ${item.description}` : item.name}
                    variants={cardVariants}
                    whileHover={{ y: -3, scale: 1.01 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
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
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
