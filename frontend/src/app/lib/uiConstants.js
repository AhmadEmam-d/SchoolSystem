/**
 * UI Constants for Edu Smart
 * Centralized design tokens for consistency across the application
 */

// Spacing Scale (using Tailwind's default scale)
export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
};

// Border Radius
export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.625rem',   // 10px (theme default)
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
};

// Shadows (matching Tailwind's scale)
export const SHADOWS = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  none: 'none',
};

// Color Palette (Primary colors used in the app)
export const COLORS = {
  primary: {
    light: '#818cf8',   // indigo-400
    DEFAULT: '#4f46e5', // indigo-600
    dark: '#3730a3',    // indigo-800
  },
  success: {
    light: '#4ade80',   // green-400
    DEFAULT: '#16a34a', // green-600
    dark: '#15803d',    // green-700
  },
  warning: {
    light: '#fbbf24',   // amber-400
    DEFAULT: '#d97706', // amber-600
    dark: '#b45309',    // amber-700
  },
  danger: {
    light: '#f87171',   // red-400
    DEFAULT: '#dc2626', // red-600
    dark: '#b91c1c',    // red-700
  },
  info: {
    light: '#38bdf8',   // sky-400
    DEFAULT: '#0284c7', // sky-600
    dark: '#0369a1',    // sky-700
  },
  purple: {
    light: '#c084fc',   // purple-400
    DEFAULT: '#9333ea', // purple-600
    dark: '#7e22ce',    // purple-700
  },
};

// Status Colors
export const STATUS_COLORS = {
  present: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  absent: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  late: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  completed: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
  ongoing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  upcoming: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  active: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  inactive: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
};

/**
 * Theme-aware chart colors
 * These functions return colors based on the current theme (light/dark)
 */
export const getChartColors = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    primary: isDark ? 'hsl(217, 91%, 60%)' : 'hsl(221, 83%, 53%)',      // Blue
    secondary: isDark ? 'hsl(142, 71%, 45%)' : 'hsl(142, 76%, 36%)',    // Green
    tertiary: isDark ? 'hsl(38, 92%, 50%)' : 'hsl(32, 95%, 44%)',       // Orange
    quaternary: isDark ? 'hsl(271, 91%, 65%)' : 'hsl(262, 83%, 58%)',   // Purple
    quinary: isDark ? 'hsl(330, 81%, 60%)' : 'hsl(336, 84%, 57%)',      // Pink
    
    success: isDark ? 'hsl(142, 71%, 45%)' : 'hsl(142, 76%, 36%)',
    warning: isDark ? 'hsl(38, 92%, 50%)' : 'hsl(32, 95%, 44%)',
    danger: isDark ? 'hsl(0, 84%, 60%)' : 'hsl(0, 72%, 51%)',
    
    // Chart-specific colors (array for multiple series)
    chart1: isDark ? 'hsl(217, 91%, 60%)' : 'hsl(221, 83%, 53%)',
    chart2: isDark ? 'hsl(142, 71%, 45%)' : 'hsl(142, 76%, 36%)',
    chart3: isDark ? 'hsl(38, 92%, 50%)' : 'hsl(32, 95%, 44%)',
    chart4: isDark ? 'hsl(271, 91%, 65%)' : 'hsl(262, 83%, 58%)',
    chart5: isDark ? 'hsl(330, 81%, 60%)' : 'hsl(336, 84%, 57%)',
    
    // UI elements
    grid: isDark ? 'hsl(215, 20%, 25%)' : 'hsl(220, 13%, 91%)',
    axis: isDark ? 'hsl(215, 16%, 47%)' : 'hsl(220, 9%, 46%)',
    tooltip: isDark ? 'hsl(222, 47%, 16%)' : 'hsl(0, 0%, 100%)',
    tooltipBorder: isDark ? 'hsl(215, 20%, 25%)' : 'hsl(220, 13%, 91%)',
  };
};

// Grade distribution colors (semantic)
export const getGradeColors = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    A: isDark ? 'hsl(142, 71%, 45%)' : 'hsl(142, 76%, 36%)',  // Green
    B: isDark ? 'hsl(217, 91%, 60%)' : 'hsl(221, 83%, 53%)',  // Blue
    C: isDark ? 'hsl(38, 92%, 50%)' : 'hsl(32, 95%, 44%)',    // Orange
    D: isDark ? 'hsl(0, 84%, 60%)' : 'hsl(0, 72%, 51%)',      // Red
  };
};

// Attendance colors
export const getAttendanceColors = () => {
  const isDark = document.documentElement.classList.contains('dark');
  
  return {
    present: isDark ? 'hsl(142, 71%, 45%)' : 'hsl(142, 76%, 36%)',  // Green
    absent: isDark ? 'hsl(0, 84%, 60%)' : 'hsl(0, 72%, 51%)',       // Red
    late: isDark ? 'hsl(38, 92%, 50%)' : 'hsl(32, 95%, 44%)',       // Orange
  };
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Component-specific styles
export const COMPONENT_STYLES = {
  card: {
    base: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
    shadow: 'shadow-sm hover:shadow-md transition-shadow',
    padding: 'p-6',
  },
  button: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    },
    variants: {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      secondary: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
      outline: 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200',
      destructive: 'bg-red-600 hover:bg-red-700 text-white',
      ghost: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200',
    },
  },
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
  },
  input: {
    base: 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors',
  },
  table: {
    wrapper: 'overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700',
    table: 'w-full',
    thead: 'bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700',
    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
    tbody: 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700',
    tr: 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
    td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100',
  },
};

// Layout constants
export const LAYOUT = {
  sidebarWidth: '16rem',      // 256px (w-64)
  navbarHeight: '4rem',       // 64px (h-16)
  maxContentWidth: '80rem',   // 1280px (max-w-7xl)
  containerPadding: {
    mobile: '1rem',   // 16px (p-4)
    tablet: '1.5rem', // 24px (p-6)
    desktop: '2rem',  // 32px (p-8)
  },
};

// Z-index scale
export const Z_INDEX = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
};

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// Animation durations
export const ANIMATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};

// Common class combinations
export const COMMON_CLASSES = {
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  absoluteCenter: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
  fullSize: 'w-full h-full',
  textTruncate: 'truncate overflow-hidden whitespace-nowrap',
  srOnly: 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
};

// Export default object with all constants
export default {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  COLORS,
  STATUS_COLORS,
  TYPOGRAPHY,
  COMPONENT_STYLES,
  LAYOUT,
  Z_INDEX,
  BREAKPOINTS,
  ANIMATION,
  COMMON_CLASSES,
};