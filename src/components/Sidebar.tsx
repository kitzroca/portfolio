import React from 'react';
import { UserProfile, NavItem, SocialLink } from '../types/portfolio';

interface SidebarProps {
  user: UserProfile;
  navItems: NavItem[];
  socialLinks: SocialLink[];
  activeSection: string;
  onNavClick: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  navItems,
  socialLinks,
  activeSection,
  onNavClick,
  theme,
  toggleTheme,
}) => {
  const renderSocialIcon = (icon: SocialLink['icon']) => {
    switch (icon) {
      case 'github':
        return (
          <svg viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        );
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case 'mail':
        return (
          <svg viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <aside className="sidebar" aria-label="Personal Information and Navigation">
      <div className="sidebar-scrollable">
        {/* Profile Header */}
        <header className="profile-header">
          {/* Avatar + Status/Location row */}
          <div className="profile-top-row">
            <div className="avatar-wrapper">
              <img
                src={user.avatar}
                alt={`${user.name} avatar`}
                className="avatar-img"
                width="76"
                height="76"
                loading="eager"
              />
            </div>

            <div className="profile-side-info">
              <span className="hire-badge">
                <span className="green-dot" aria-hidden="true" />
                {user.status}
              </span>
              <div className="location-text">
                <span>{user.location}</span>
              </div>
            </div>
          </div>

          {/* Name & Role */}
          <h1 className="user-name">{user.name}</h1>
          <div className="user-role">{user.role}</div>

          {/* Summary Tagline */}
          <p className="user-tagline">{user.tagline}</p>
        </header>

        {/* Vertical Nav List with Numbered Bracket Labels */}
        <nav className="sidebar-nav" aria-label="Section Navigation">
          <ul className="nav-list">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <a
                    href={`#${item.id}`}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    id={`nav-link-${item.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavClick(item.id);
                    }}
                  >
                    <span className="nav-label">{item.bracket}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Sidebar Footer (Socials, Solid White Resume Button, Theme Toggle, Copyright) */}
      <footer className="sidebar-footer">
        <div className="footer-actions-row">
          {/* Social Icons Group */}
          <div className="social-links-group" aria-label="Social Profiles">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className="icon-btn"
                target={social.url.startsWith('mailto:') ? undefined : '_blank'}
                rel={social.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                aria-label={social.aria}
              >
                {renderSocialIcon(social.icon)}
              </a>
            ))}
          </div>

          {/* Right Actions: Resume Button & Theme Toggle */}
          <div className="footer-right-actions">
            {/* Solid White Resume ↗ Button */}
              <a
              href={user.resume_link}
              target={user.resume_link.startsWith('#') ? undefined : '_blank'}
              rel={user.resume_link.startsWith('#') ? undefined : 'noopener noreferrer'}
              className="btn-resume"
              onClick={(e) => {
                if (user.resume_link.startsWith('#')) {
                  e.preventDefault();
                  onNavClick(user.resume_link.slice(1));
                }
              }}
            >
              <span>Resume</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M5 19L19 5M19 5H9M19 5V15"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </a>

            {/* Theme Toggle Button */}
            <button
              type="button"
              className="icon-btn theme-toggle-btn"
              id="theme-toggle"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
              onClick={toggleTheme}
            >
              <svg className="theme-icon-moon" viewBox="0 0 24 24">
                <path d="M12.3 2a10 10 0 0 0-.19 14 10 10 0 0 0 11.64 3.7A10 10 0 1 1 12.3 2z" />
              </svg>
              <svg className="theme-icon-sun" viewBox="0 0 24 24">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="copyright-line">{user.copyright}</div>
      </footer>
    </aside>
  );
};
