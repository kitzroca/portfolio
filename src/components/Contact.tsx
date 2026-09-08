import React, { useState } from 'react';
import { ContactSectionData } from '../types/portfolio';

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
      <div className="section-header-row">
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-contact">
            {contact.section_header}
          </h2>
        </div>
        <a
          href="#contact"
          className="section-badge-link"
          onClick={(e) => {
            e.preventDefault();
            onNavClick('contact');
          }}
        >
          {contact.nav_badge}
        </a>
      </div>

      <div className="section-rule" aria-hidden="true" />

      <div className="contact-card">
        <h3 className="contact-headline">{contact.headline}</h3>
        <p className="contact-subtitle">{contact.subtitle}</p>

        <div className="contact-channels-grid">
          {contact.channels.map((ch, idx) => (
            <div
              key={idx}
              className="channel-box"
            >
              <span className="channel-label">{ch.label}</span>
              {ch.type === 'email' ? (
                <a href={ch.action} className="channel-val">
                  <span>{ch.val}</span>
                </a>
              ) : (
                <span className="channel-val">{ch.val}</span>
              )}
            </div>
          ))}
        </div>

        <div className="contact-cta-row">
          <button
            type="button"
            className="btn-copy-email"
            id="copy-email-btn"
            data-email={contact.email}
            aria-label="Copy email address to clipboard"
            onClick={handleCopyEmail}
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
          </button>

          <a
            href={`mailto:${contact.email}`}
            className="btn-contact-primary"
          >
            <span>Send Message</span>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};
