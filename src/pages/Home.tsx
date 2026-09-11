import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialPortfolioData } from '../data/portfolioData';
import { PortfolioData } from '../types/portfolio';
import { fetchGitHubData } from '../services/githubService';
import { useTheme } from '../hooks/useTheme';
import { useMobileMenu } from '../hooks/useMobileMenu';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import { ScrollProgress } from '../components/ScrollProgress';
import { MobileNav } from '../components/MobileNav';
import { Sidebar } from '../components/Sidebar';
import { About } from '../components/About';
import { Projects } from '../components/Projects';
import { TechStack } from '../components/TechStack';
import { Vouch } from '../components/Vouch';
import { Contact } from '../components/Contact';
import { BackToTop } from '../components/BackToTop';
import { PortfolioSkeleton } from '../components/skeleton';

import { ErrorBoundary } from '../components/ErrorBoundary';

export const Home: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const { theme, toggleTheme } = useTheme();
  const { isOpen: isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  const sectionIds = ['about', 'projects', 'stack', 'vouch', 'contact'];
  const activeSection = useScrollSpy(sectionIds, 'about');
  const scrollTo = useSmoothScroll();

  // Reusable GitHub fetch & sync function supporting user retries
  const syncGitHub = useCallback(async () => {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        activity: {
          ...prev.about.activity,
          is_loading: true,
          error: null,
        },
      },
    }));

    try {
      const gh = await fetchGitHubData();
      if (!gh) {
        setData((prev) => ({
          ...prev,
          about: {
            ...prev.about,
            activity: {
              ...prev.about.activity,
              is_loading: false,
              error: 'Live GitHub activity feed currently unreachable.',
              onRetry: syncGitHub,
            },
          },
        }));
        return;
      }

      setData((prev) => {
        const next = { ...prev };
        const updatedStats = [...next.about.stats];
        const userGithubUrl = `https://github.com/${gh.profile.username || 'kitzroca'}`;

        if (gh.contributions && gh.contributions.display_total && gh.contributions.display_total !== 'N/A') {
          updatedStats[0] = {
            ...updatedStats[0],
            value: String(gh.contributions.commits || gh.contributions.total || updatedStats[0].value),
            link: userGithubUrl,
          };
        }

        const commitsCount = gh.contributions.commits || next.about.activity.commits_count;
        const totalLabel = gh.activity_stats.total_label && gh.activity_stats.total_label !== 'N/A'
          ? gh.activity_stats.total_label
          : `${commitsCount} COMMITS`;

        const updatedActivity = {
          ...next.about.activity,
          handle: `@${gh.profile.username || 'kitzroca'}`,
          handle_url: userGithubUrl,
          matrix: gh.heatmap.matrix || next.about.activity.matrix,
          progress: gh.heatmap.progress || 100,
          stats: [
            { key: 'RECENT', val: gh.activity_stats.recent_label || 'ACTIVE' },
            { key: 'TOTAL', val: totalLabel },
            { key: 'STATUS', val: 'CONTINUOUS SHIPPING' },
          ],
          commits_count: commitsCount,
          is_loading: false,
          has_live_data: true,
          error: null,
          onRetry: syncGitHub,
        };

        return {
          ...next,
          about: {
            ...next.about,
            stats: updatedStats,
            activity: updatedActivity,
          },
        };
      });
    } catch {
      setData((prev) => ({
        ...prev,
        about: {
          ...prev.about,
          activity: {
            ...prev.about.activity,
            is_loading: false,
            error: 'Network error occurred while fetching GitHub activity.',
            onRetry: syncGitHub,
          },
        },
      }));
    }
  }, []);

  // Initial page loading coordinator: Guaranteed fast transition, prevents hanging on cold load
  useEffect(() => {
    let isMounted = true;

    if (typeof document !== 'undefined' && data.page_title) {
      document.title = data.page_title;
    }

    // Trigger GitHub data fetch
    syncGitHub();

    // Fast safety transition: prevents cold-start hang on slow font networks
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setIsPageLoading(false);
      }
    }, 280);

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready
        .then(() => {
          if (isMounted) setIsPageLoading(false);
        })
        .catch(() => {
          if (isMounted) setIsPageLoading(false);
        });
    }

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [syncGitHub]);

  return (
    <ErrorBoundary>
      <AnimatePresence>
        {isPageLoading ? (
          <motion.div
            key="portfolio-skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}
          >
            <PortfolioSkeleton />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        key="portfolio-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="portfolio-app"
      >
        {/* Subtle 4px Top Gradient Bar */}
        <ScrollProgress />

        {/* Mobile Fixed Top Navbar */}
        <MobileNav
          user={data.user}
          navItems={data.nav_items}
          activeSection={activeSection}
          onNavClick={scrollTo}
          theme={theme}
          toggleTheme={toggleTheme}
          isMenuOpen={isMenuOpen}
          toggleMenu={toggleMenu}
          closeMenu={closeMenu}
        />

        {/* Master Two-Column Container (Max 1440px, Centered) */}
        <div className="site-wrapper">
          {/* Left Sidebar (Completely static, no motion) */}
          <Sidebar
            user={data.user}
            navItems={data.nav_items}
            socialLinks={data.social_links}
            activeSection={activeSection}
            onNavClick={scrollTo}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          {/* Right Scrollable Content Area */}
          <main className="content-area" id="main-content">
            <About about={data.about} onNavClick={scrollTo} />
            <Projects projects={data.projects} onNavClick={scrollTo} />
            <TechStack stack={data.stack} onNavClick={scrollTo} />
            <Vouch vouch={data.vouch} onNavClick={scrollTo} />
            <Contact contact={data.contact} onNavClick={scrollTo} />
          </main>
        </div>

        {/* Floating Circular Back to Top Button */}
        <BackToTop />
      </motion.div>
    </ErrorBoundary>
  );
};
