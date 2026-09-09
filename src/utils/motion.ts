import { Variants, Transition, TargetAndTransition } from 'framer-motion';

/**
 * Premium Minimalist Motion System
 * Inspired by high-end design engineering (Linear, Apple, Vercel).
 * Subtle, fluid, performant, and section-specific.
 */

export const SMOOTH_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const TRANSITION_SMOOTH: Transition = {
  duration: 0.65,
  ease: SMOOTH_EASE,
};

export const TRANSITION_FAST: Transition = {
  duration: 0.35,
  ease: SMOOTH_EASE,
};

export const VIEWPORT_ONCE = {
  once: true,
  margin: '-50px',
};

/**
 * Stagger children container variant
 */
export const staggerContainer = (
  staggerChildren = 0.08,
  delayChildren = 0.05
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Fade in and slide up from bottom
 */
export const fadeInUp = (distance = 24, delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    y: distance,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay,
      ease: SMOOTH_EASE,
    },
  },
});

/**
 * Slide in from opposite direction (top or right) for About visual metrics
 */
export const fadeInFrom = (direction: 'left' | 'right' | 'top' | 'bottom' = 'bottom', distance = 20, delay = 0): Variants => {
  const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
  const y = direction === 'top' ? -distance : direction === 'bottom' ? distance : 0;
  return {
    hidden: {
      opacity: 0,
      x,
      y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.65,
        delay,
        ease: SMOOTH_EASE,
      },
    },
  };
};

/**
 * Hero cinematic entrance
 * Main heading fades in while slightly scaling from 95% -> 100%
 */
export const heroHeading: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: SMOOTH_EASE,
    },
  },
};

/**
 * Fade in with subtle scale
 */
export const scaleIn = (delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay,
      ease: SMOOTH_EASE,
    },
  },
});

/**
 * Tech Stack: Alternating subtle horizontal movement (odd left, even right)
 */
export const techCardAlternating = (index: number): Variants => ({
  hidden: {
    opacity: 0,
    x: index % 2 === 0 ? -12 : 12,
    y: 10,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: SMOOTH_EASE,
    },
  },
});

/**
 * Tech Icon scale from 90% -> 100%
 */
export const iconScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: SMOOTH_EASE,
    },
  },
};

/**
 * Projects: Dynamic alternating horizontal + vertical motion
 * Some cards slide slightly from left, others from right
 */
export const projectCardSlide = (index: number): Variants => ({
  hidden: {
    opacity: 0,
    x: index % 2 === 0 ? -28 : 28,
    y: 18,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.65,
      ease: SMOOTH_EASE,
    },
  },
});

/**
 * Peer Vouches: Staggered cascading reveal (card 1 -> card 2 -> card 3)
 */
export const vouchCascade = (index: number): Variants => ({
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: (index % 6) * 0.12,
      ease: SMOOTH_EASE,
    },
  },
});

/**
 * Contact: Fade + blur-to-sharp reveal
 */
export const blurToSharp = (delay = 0): Variants => ({
  hidden: {
    opacity: 0,
    filter: 'blur(8px)',
    y: 14,
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: {
      duration: 0.75,
      delay,
      ease: SMOOTH_EASE,
    },
  },
});

/**
 * Card reveal item inside staggered containers
 */
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: SMOOTH_EASE,
    },
  },
};

/**
 * Subtle interactive hover preset for cards
 */
export const cardHover: TargetAndTransition = {
  y: -4,
  transition: {
    duration: 0.25,
    ease: 'easeOut',
  },
};

export const buttonTap: TargetAndTransition = {
  scale: 0.97,
  transition: {
    duration: 0.15,
  },
};
