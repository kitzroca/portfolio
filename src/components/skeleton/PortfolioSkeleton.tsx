import React from 'react';
import { MobileNavSkeleton } from './MobileNavSkeleton';
import { HeroSkeleton } from './HeroSkeleton';
import { AboutSkeleton } from './AboutSkeleton';
import { ProjectsSkeleton } from './ProjectsSkeleton';
import { TechStackSkeleton } from './TechStackSkeleton';
import { VouchSkeleton } from './VouchSkeleton';
import { ContactSkeleton } from './ContactSkeleton';

export const PortfolioSkeleton: React.FC = () => {
  return (
    <div
      className="portfolio-app skeleton-wrapper"
      role="status"
      aria-busy="true"
      aria-label="Loading developer portfolio content"
    >
      {/* Top 4px accent bar placeholder */}
      <div
        className="top-accent-bar skeleton-shimmer"
        style={{
          width: '100%',
          height: 4,
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999,
          borderRadius: 0,
        }}
      />

      {/* Mobile Top Nav Skeleton */}
      <MobileNavSkeleton />

      {/* Master Two-Column Container (Max 1440px, Centered) */}
      <div className="site-wrapper">
        {/* Left Sidebar Skeleton (Hero) */}
        <HeroSkeleton />

        {/* Right Scrollable Content Area Skeleton */}
        <main className="content-area" id="main-content-skeleton">
          <AboutSkeleton />
          <ProjectsSkeleton />
          <TechStackSkeleton />
          <VouchSkeleton />
          <ContactSkeleton />
        </main>
      </div>
    </div>
  );
};
