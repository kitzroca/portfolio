import React, { useState, useEffect } from 'react';
import { VouchSectionData, VouchItem } from '../types/portfolio';
import {
  fetchLiveVouches,
  submitLiveVouch,
  deleteLiveVouch,
} from '../services/vouchService';

interface VouchProps {
  vouch: VouchSectionData;
  onNavClick: (id: string) => void;
}

export const Vouch: React.FC<VouchProps> = ({ vouch, onNavClick }) => {
  const [items, setItems] = useState<VouchItem[]>(vouch.items || []);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company_or_institution: '',
    quote: '',
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Load live vouches on mount
  useEffect(() => {
    let isMounted = true;
    fetchLiveVouches().then((liveVouches) => {
      if (!isMounted) return;
      if (Array.isArray(liveVouches) && liveVouches.length > 0) {
        setItems(liveVouches);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenModal = () => {
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError(null);
    setFormData({
      name: '',
      role: '',
      company_or_institution: '',
      quote: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      setFormError('Please enter your name and endorsement quote.');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);
      const newVouch = await submitLiveVouch({
        name: formData.name,
        role: formData.role || 'Collaborator',
        company_or_institution: formData.company_or_institution || 'Project Peer',
        quote: formData.quote,
      });

      setItems((prev) => [newVouch, ...prev]);
      handleCloseModal();
      setToastMessage('Thank you! Your endorsement has been posted live.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit vouch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove the endorsement from ${name}?`
    );
    if (!confirmed) return;

    try {
      await deleteLiveVouch(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setToastMessage('Endorsement removed successfully.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error('Failed to delete vouch:', err);
      alert('Failed to remove endorsement. Please try again.');
    }
  };

  // Only show the 6 newest vouches by default; view all button expands
  const visibleItems = showAll ? items : items.slice(0, 6);

  return (
    <section
      className="content-section"
      id={vouch.section_id}
      aria-labelledby="heading-vouch"
    >
      <div className="section-header-row">
        <div className="section-title-wrap">
          <h2 className="section-title" id="heading-vouch">
            {vouch.section_header}
          </h2>
        </div>

        <div className="vouch-header-actions">
          <button
            type="button"
            className="btn-vouch-add"
            onClick={handleOpenModal}
            aria-label="Leave a peer endorsement"
          >
            <span className="vouch-add-plus">+</span> VOUCH KITZ
          </button>
          <a
            href="#vouch"
            className="section-badge-link"
            onClick={(e) => {
              e.preventDefault();
              onNavClick('vouch');
            }}
          >
            COLLABORATOR VOUCH [{items.length}]
          </a>
        </div>
      </div>

      <div className="section-rule" aria-hidden="true" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="vouch-toast" role="status">
          <span className="vouch-toast-dot" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3-Column Vouch Grid (Max 6 shown by default) */}
      {items.length > 0 ? (
        <>
          <div className="vouch-grid">
            {visibleItems.map((item) => (
              <article key={item.id} className="vouch-card">
                <div className="vouch-card-top-row">
                  <span className="vouch-quote-mark" aria-hidden="true">
                    “
                  </span>
                  <button
                    type="button"
                    className="vouch-delete-btn"
                    title="Delete endorsement"
                    aria-label={`Delete endorsement from ${item.name}`}
                    onClick={() => handleDelete(item.id, item.name)}
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </button>
                </div>

                <p className="vouch-quote">{item.quote}</p>

                <div className="vouch-author-row">
                  <div className="author-avatar-initials" aria-hidden="true">
                    {item.initials}
                  </div>
                  <div className="author-meta">
                    <span className="author-name">{item.name}</span>
                    <span className="author-role-company">
                      {item.role} · {item.company_or_institution}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* View All / Show Less Button if more than 6 vouches exist */}
          {items.length > 6 && (
            <div className="vouch-view-all-row">
              <button
                type="button"
                className="btn-vouch-view-all"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? (
                  <>Show Less ↑</>
                ) : (
                  <>View All Endorsements ({items.length}) ↓</>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="vouch-empty-card">
          <p className="vouch-empty-title">No Vouches Yet</p>
          <p className="vouch-empty-desc">
            Worked with Kitz? Leave a vouch!
          </p>
          <button
            type="button"
            className="btn-vouch-empty-cta"
            onClick={handleOpenModal}
          >
            Be the First to Vouch ↗
          </button>
        </div>
      )}

      {/* Submission Modal */}
      {isModalOpen && (
        <div
          className="vouch-modal-backdrop"
          onClick={handleCloseModal}
          role="presentation"
        >
          <div
            className="vouch-modal-container"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vouch-modal-title"
          >
            <div className="vouch-modal-header">
              <div className="vouch-modal-header-text">
                <span className="vouch-modal-badge">[ LIVE CLOUD VOUCH ]</span>
                <h3 className="vouch-modal-title" id="vouch-modal-title">
                  Vouch for Kitz B. Roca
                </h3>
                <p className="vouch-modal-subtitle">
                  Share your genuine feedback, collaboration experience, or technical vouch. It will be posted directly to the portfolio.
                </p>
              </div>
              <button
                type="button"
                className="vouch-modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="vouch-modal-form">
              {formError && (
                <div className="vouch-form-error" role="alert">
                  {formError}
                </div>
              )}

              <div className="vouch-form-field">
                <label htmlFor="vouch-name" className="vouch-form-label">
                  Your Full Name <span className="req">*</span>
                </label>
                <input
                  id="vouch-name"
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  className="vouch-form-input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  maxLength={70}
                />
              </div>

              <div className="vouch-form-row">
                <div className="vouch-form-field">
                  <label htmlFor="vouch-role" className="vouch-form-label">
                    Your Role / Title
                  </label>
                  <input
                    id="vouch-role"
                    type="text"
                    placeholder="e.g. Full-Stack Developer"
                    className="vouch-form-input"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    maxLength={70}
                  />
                </div>

                <div className="vouch-form-field">
                  <label htmlFor="vouch-org" className="vouch-form-label">
                    Project or Affiliation
                  </label>
                  <input
                    id="vouch-org"
                    type="text"
                    placeholder="e.g. OFF GPT Collaborator / EVSU"
                    className="vouch-form-input"
                    value={formData.company_or_institution}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company_or_institution: e.target.value,
                      })
                    }
                    maxLength={80}
                  />
                </div>
              </div>

              <div className="vouch-form-field">
                <div className="vouch-label-counter-row">
                  <label htmlFor="vouch-quote" className="vouch-form-label">
                    Endorsement / Recommendation <span className="req">*</span>
                  </label>
                  <span className="vouch-char-counter">
                    {formData.quote.length} / 500
                  </span>
                </div>
                <textarea
                  id="vouch-quote"
                  required
                  rows={4}
                  placeholder="How was working with Kitz? Share his strengths, work ethic, or technical problem solving..."
                  className="vouch-form-textarea"
                  value={formData.quote}
                  onChange={(e) =>
                    setFormData({ ...formData, quote: e.target.value })
                  }
                  maxLength={500}
                />
              </div>

              <div className="vouch-modal-actions">
                <button
                  type="button"
                  className="btn-vouch-cancel"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-vouch-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting Vouch...' : 'Publish Vouch ↗'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
