import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ContactSectionData } from '../types/portfolio';
import {
  fadeInUp,
  blurToSharp,
  staggerContainer,
  cardVariants,
  VIEWPORT_ONCE,
  buttonTap,
} from '../utils/motion';

interface ContactProps {
  contact: ContactSectionData;
  onNavClick: (id: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ contact, onNavClick }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contact.email);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = contact.email;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2200);
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
  };

  return (
    <section
      className="content-section"
      id={contact.section_id}
      aria-labelledby="heading-contact"
    >
      <motion.div
        className="section-header-row"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={fadeInUp(18)}
      >
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-contact">
            {contact.section_header}
          </h2>
        </div>
        <motion.a
          href="#contact"
          className="section-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('contact');
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {contact.nav_badge}
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
        className="contact-card"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={fadeInUp(22)}
      >
        {/* 07 — CONTACT: Fade + Blur-to-Sharp reveal */}
        <motion.h3 className="contact-headline" variants={blurToSharp(0.05)}>
          {contact.headline}
        </motion.h3>

        {/* Description fades into view */}
        <motion.p className="contact-subtitle" variants={fadeInUp(14, 0.15)}>
          {contact.subtitle}
        </motion.p>

        <motion.div
          className="contact-channels-grid"
          variants={staggerContainer(0.06, 0.1)}
        >
          {contact.channels.map((ch, idx) => (
            <motion.div
              key={idx}
              className="channel-box"
              variants={cardVariants}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <span className="channel-label">{ch.label}</span>
              {ch.type === 'email' ? (
                <a href={ch.action} className="channel-val">
                  <span>{ch.val}</span>
                </a>
              ) : (
                <span className="channel-val">{ch.val}</span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Contact buttons appear with a small upward movement */}
        <motion.div className="contact-cta-row" variants={fadeInUp(14, 0.22)}>
          <motion.button
            type="button"
            className="btn-copy-email"
            id="copy-email-btn"
            data-email={contact.email}
            aria-label="Copy email address to clipboard"
            onClick={handleCopyEmail}
            whileHover={{ scale: 1.02 }}
            whileTap={buttonTap}
            style={
              isCopied
                ? {
                    borderColor: 'var(--accent-green)',
                    color: 'var(--accent-green)',
                  }
                : undefined
            }
          >
            {isCopied ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>COPIED TO CLIPBOARD</span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                </svg>
                <span>{contact.email}</span>
              </>
            )}
          </motion.button>

          <motion.a
            href={`mailto:${contact.email}`}
            className="btn-contact-primary"
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={buttonTap}
          >
            <span>Send Message</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};
