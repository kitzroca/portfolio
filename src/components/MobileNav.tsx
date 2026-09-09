import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile, NavItem } from '../types/portfolio';
import { buttonTap } from '../utils/motion';

interface MobileNavProps {
  user: UserProfile;
  navItems: NavItem[];
  activeSection: string;
  onNavClick: (id: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  user,
  navItems,
  activeSection,
  onNavClick,
  theme,
  toggleTheme,
  isMenuOpen,
  toggleMenu,
  closeMenu,
}) => {
  return (
    <header className="mobile-top-nav" id="mobile-top-nav" aria-label="Mobile Navigation">
      <div className="mobile-nav-container">
        {/* Brand: Green Status Dot + Name */}
        <a
          href="#about"
          className="mobile-nav-brand"
          aria-label={`${user.name} home`}
          onClick={(e) => {
            e.preventDefault();
            onNavClick('about');
          }}
        >
          <span className="green-dot" aria-hidden="true" />
          <span className="mobile-nav-name">{user.name}</span>
        </a>

        {/* Right Controls: Theme Toggle & Hamburger Button */}
        <div className="mobile-nav-controls">
          {/* Theme Toggle Button */}
          <motion.button
            type="button"
            className="icon-btn mobile-theme-btn"
            id="mobile-theme-toggle"
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            onClick={toggleTheme}
            whileTap={buttonTap}
          >
            <svg className="theme-icon-moon" viewBox="0 0 24 24">
              <path d="M12.3 2a10 10 0 0 0-.19 14 10 10 0 0 0 11.64 3.7A10 10 0 1 1 12.3 2z" />
            </svg>
            <svg className="theme-icon-sun" viewBox="0 0 24 24">
              <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
            </svg>
          </motion.button>

          {/* Burger Toggle Button */}
          <motion.button
            type="button"
            className={`icon-btn mobile-burger-btn ${isMenuOpen ? 'open' : ''}`}
            id="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu-drawer"
            onClick={(e) => {
              e.stopPropagation();
              toggleMenu();
            }}
            whileTap={buttonTap}
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
            <span className="burger-bar" />
          </motion.button>
        </div>
      </div>

      {/* Mobile Dropdown / Drawer Menu */}
      <div
        className={`mobile-menu-drawer ${isMenuOpen ? 'open' : ''}`}
        id="mobile-menu-drawer"
        aria-hidden={!isMenuOpen}
      >
        <nav className="mobile-drawer-nav" aria-label="Mobile Navigation Menu">
          <ul className="mobile-nav-list">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <li key={item.id} className="mobile-nav-item">
                  <a
                    href={`#${item.id}`}
                    className={`mobile-nav-link nav-link ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavClick(item.id);
                      closeMenu();
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

      {/* Backdrop overlay for mobile drawer */}
      <div
        className={`mobile-drawer-backdrop ${isMenuOpen ? 'open' : ''}`}
        id="mobile-drawer-backdrop"
        aria-hidden={!isMenuOpen}
        onClick={closeMenu}
      />
    </header>
  );
};
