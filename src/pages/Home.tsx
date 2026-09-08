import React, { useState, useEffect } from 'react';
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

export const Home: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const { theme, toggleTheme } = useTheme();
  const { isOpen: isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();
  const sectionIds = ['about', 'projects', 'stack', 'vouch', 'contact'];
  const activeSection = useScrollSpy(sectionIds, 'about');
  const scrollTo = useSmoothScroll();

  useEffect(() => {
    let isMounted = true;
    fetchGitHubData().then((gh) => {
      if (!gh || !isMounted) return;

      setData((prev) => {
        const next = { ...prev };
        const updatedStats = [...next.about.stats];
        if (gh.contributions.display_total !== 'N/A') {
          updatedStats[0] = {
            ...updatedStats[0],
            value: gh.contributions.display_total,
            link: gh.profile.github_url,
          };
        }

        const updatedActivity = {
          ...next.about.activity,
          handle: `@${gh.profile.username}`,
          handle_url: gh.profile.github_url,
          matrix: gh.heatmap.matrix,
          progress: gh.heatmap.progress,
          stats: [
            { key: 'RECENT', val: gh.activity_stats.recent_label },
            { key: 'COMMITS', val: `${gh.contributions.commits || 2} COMMITS` },
            { key: 'TOTAL', val: gh.activity_stats.total_label },
            { key: 'STATUS', val: 'CONTINUOUS SHIPPING' },
          ],
          commits_count: gh.contributions.commits || 2,
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
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="portfolio-app">
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
        {/* Left Sidebar */}
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
    </div>
  );
};
