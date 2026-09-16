/**
 * Centralized Framer Motion Animation Variants & Spring Profiles
 * 
 * Enforces smooth, soft, and subtle animations across:
 * - Work process timeline accordion (AgentProcessTimeline)
 * - Thought reasoning accordion (AgentThoughtAccordion)
 * - Ambient floating background meshes & edge breathing glows
 * - Dual-point orbiting chat input aura
 * - Staggered layout entrances and tactile interaction scales
 */

import type { Variants, TargetAndTransition, Transition } from 'framer-motion';

/**
 * Architectural cubic bezier deceleration curve.
 * Starts smoothly and settles gently into place without bounce or jitter.
 */
export const EASING_ARCHITECTURAL = [0.16, 1, 0.3, 1] as const;

/* ==========================================================================
   1. LAYOUT & ACCORDION EXPANSION VARIANTS
   ========================================================================== */

/**
 * Smooth, jitter-free height and opacity collapse/expand variants for accordions & detail drawers.
 */
export const accordionVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.22, ease: EASING_ARCHITECTURAL },
      opacity: { duration: 0.16, ease: 'easeOut' },
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.26, ease: EASING_ARCHITECTURAL },
      opacity: { duration: 0.2, delay: 0.02, ease: 'easeIn' },
    },
  },
};

/**
 * Clean width and opacity collapse for sidebar item labels and action containers.
 */
export const sidebarHorizontalCollapseVariants: Variants = {
  collapsed: {
    opacity: 0,
    width: 0,
    transition: {
      width: { duration: 0.26, ease: EASING_ARCHITECTURAL },
      opacity: { duration: 0.12, ease: 'easeOut' },
    },
    transitionEnd: {
      display: 'none',
    },
  },
  expanded: {
    display: 'flex',
    opacity: 1,
    width: 'auto',
    transition: {
      width: { duration: 0.28, ease: EASING_ARCHITECTURAL },
      opacity: { duration: 0.2, delay: 0.06, ease: EASING_ARCHITECTURAL },
    },
  },
};

/**
 * Height and margin collapse for sidebar group section headings.
 */
export const sidebarHeadingCollapseVariants: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    marginBottom: 0,
    transition: {
      height: { duration: 0.22, ease: EASING_ARCHITECTURAL },
      opacity: { duration: 0.1, ease: 'easeOut' },
      marginBottom: { duration: 0.22, ease: EASING_ARCHITECTURAL },
    },
  },
  expanded: {
    height: 'auto',
    opacity: 1,
    marginBottom: 4,
    transition: {
      height: { duration: 0.26, ease: EASING_ARCHITECTURAL },
      opacity: { duration: 0.18, delay: 0.04, ease: EASING_ARCHITECTURAL },
      marginBottom: { duration: 0.26, ease: EASING_ARCHITECTURAL },
    },
  },
};

/**
 * Smooth transition configuration for Left Sidebar width changes.
 */
export const sidebarSpringTransition: Transition = {
  duration: 0.28,
  ease: EASING_ARCHITECTURAL,
};

/* ==========================================================================
   2. STAGGERED ENTRANCES & DIALOG VARIANTS
   ========================================================================== */

/**
 * Generic staggered orchestrator for empty state and pill groups.
 */
export const emptyStateContainerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: EASING_ARCHITECTURAL,
      staggerChildren: 0.06,
      delayChildren: 0.03,
    },
  },
};

export const emptyStatePillsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

/**
 * Unified subtle upward drift & fade entrance for empty state child elements.
 */
export const emptyStateItemVariants: Variants = {
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.36,
      ease: EASING_ARCHITECTURAL,
    },
  },
};

// Aliases for component convenience & backward compatibility
export const emptyStateIconVariants = emptyStateItemVariants;
export const emptyStateTextVariants = emptyStateItemVariants;
export const emptyStateInputVariants = emptyStateItemVariants;
export const emptyStatePillItemVariants = emptyStateItemVariants;

/**
 * Modal backdrop and dialog container transitions.
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.18, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.14, ease: 'easeIn' },
  },
};

export const modalContentVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 8,
    transition: { duration: 0.16, ease: 'easeOut' },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.22, ease: EASING_ARCHITECTURAL },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 6,
    transition: { duration: 0.14, ease: 'easeIn' },
  },
};

/**
 * Chat message bubble entrance transition.
 */
export const messageEntranceVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: EASING_ARCHITECTURAL },
  },
};

export const draftIndicatorVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASING_ARCHITECTURAL },
  },
};

/**
 * Icon swap transition for AnimatePresence mode="wait" (e.g. send/stop button).
 */
export const iconSwapVariants: Variants = {
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.15 } },
  exit: { scale: 0.6, opacity: 0, transition: { duration: 0.15 } },
};

/* ==========================================================================
   3. TACTILE TOUCH & HOVER MICRO-INTERACTIONS
   ========================================================================== */

export const tapScaleIcon: TargetAndTransition = {
  scale: 0.88,
  transition: { duration: 0.08, ease: 'easeOut' },
};

export const tapScaleAccordion: TargetAndTransition = {
  scale: 0.98,
  transition: { duration: 0.1, ease: 'easeOut' },
};

export const tapScalePill: TargetAndTransition = {
  scale: 0.96,
  transition: { duration: 0.1, ease: 'easeOut' },
};

export const hoverLiftPill: TargetAndTransition = {
  y: -1,
  transition: { duration: 0.15, ease: 'easeOut' },
};

export const hoverScaleIcon: TargetAndTransition = {
  scale: 1.05,
  transition: { duration: 0.12, ease: 'easeOut' },
};


