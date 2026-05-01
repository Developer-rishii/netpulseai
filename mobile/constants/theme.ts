// NetPulse AI — Mobile Design System
// Deep dark telecom aesthetic with cyan/violet accents

export const Colors = {
  // Core backgrounds
  background: '#0e0f1a',
  card: '#161829',
  cardElevated: '#1c1e35',
  surface: '#1f2140',

  // Text
  foreground: '#f0f1f5',
  muted: '#6b7094',
  mutedForeground: '#8b90b5',

  // Brand accents
  cyan: '#00e5ff',
  cyanDim: 'rgba(0, 229, 255, 0.12)',
  cyanGlow: 'rgba(0, 229, 255, 0.35)',
  violet: '#9c5cff',
  violetDim: 'rgba(156, 92, 255, 0.12)',
  neon: '#00ffd5',

  // Status
  good: '#00e5a0',
  goodDim: 'rgba(0, 229, 160, 0.12)',
  warning: '#ff9f43',
  warningDim: 'rgba(255, 159, 67, 0.12)',
  critical: '#ff4757',
  criticalDim: 'rgba(255, 71, 87, 0.12)',

  // Borders
  border: 'rgba(99, 107, 155, 0.2)',
  borderCyan: 'rgba(0, 229, 255, 0.2)',
  borderViolet: 'rgba(156, 92, 255, 0.2)',

  // Tab bar
  tabBar: '#0a0b14',
  tabBarBorder: 'rgba(0, 229, 255, 0.08)',
  tabInactive: '#4a4f73',
  tabActive: '#00e5ff',
};

export const Gradients = {
  brand: ['#00e5ff', '#9c5cff'] as const,
  brandReverse: ['#9c5cff', '#00e5ff'] as const,
  cardGlow: ['rgba(0, 229, 255, 0.06)', 'rgba(156, 92, 255, 0.03)', 'transparent'] as const,
  darkFade: ['#0e0f1a', 'transparent'] as const,
  surface: ['rgba(22, 24, 41, 0.95)', 'rgba(22, 24, 41, 0.7)'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 50,
};

export const Typography = {
  mono: {
    fontFamily: 'SpaceMono',
  },
  label: {
    fontFamily: 'SpaceMono',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: Colors.muted,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.foreground,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.foreground,
  },
  body: {
    fontSize: 14,
    color: Colors.mutedForeground,
    lineHeight: 20,
  },
  metric: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.foreground,
    letterSpacing: -1,
  },
  metricUnit: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.muted,
  },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  }),
};
