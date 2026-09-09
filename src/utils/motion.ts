import { Variants, Transition, TargetAndTransition } from 'framer-motion';

/**
 * Premium Minimalist Motion System
 * Inspired by high-end design engineering (Linear, Apple, Vercel).
 * Subtle, fluid, performant, and respectful of user preferences.
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
  y: -3,
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
