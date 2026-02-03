// Application constants

// API endpoints (for reference, actual base URL is in api.js)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    BASE: '/users',
    TEAM: '/users/team',
    WORKERS: '/users/workers',
  },
  WORK_ENTRIES: {
    BASE: '/work-entries',
    SUBMIT: '/work-entries/:id/submit',
    WORKER: '/work-entries/worker/:id',
    STATUS: '/work-entries/status/:status',
    DATE_RANGE: '/work-entries/date-range',
    STATS: '/work-entries/stats',
  },
  APPROVALS: {
    BASE: '/approvals',
    PENDING: '/approvals/pending',
    PROCESSED: '/approvals/processed',
    PROCESS: '/approvals/:id/process',
    STATS: '/approvals/stats',
    WORKER: '/approvals/worker/:id',
    HISTORY: '/approvals/history/:id',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    UNREAD: '/notifications/unread',
    MARK_READ: '/notifications/:id/read',
    MARK_ALL_READ: '/notifications/mark-all-read',
    COUNT: '/notifications/count',
  },
  PROJECTS: {
    BASE: '/projects',
    MEMBERS: '/projects/:id/members',
    WORK_ENTRIES: '/projects/:id/work-entries',
    STATS: '/projects/:id/stats',
  },
  COMMENTS: {
    BASE: '/comments',
    WORK_ENTRY: '/comments/work-entry/:id',
    APPROVAL: '/comments/approval/:id',
  },
  REPORTS: {
    WORK: '/reports/work',
    APPROVALS: '/reports/approvals',
    TEAM: '/reports/team',
    FINANCIAL: '/reports/financial',
    DOWNLOAD: '/reports/download/:id',
  },
  UPLOAD: {
    BASE: '/upload',
  },
  DASHBOARD: {
    OVERVIEW: '/dashboard/overview',
    ACTIVITY: '/dashboard/recent-activity',
    PERFORMANCE: '/dashboard/performance',
    DEADLINES: '/dashboard/upcoming-deadlines',
  },
};

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  APPROVER: 'approver',
  WORKER: 'worker',
};

// Work entry statuses
export const WORK_ENTRY_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REVISED: 'revised',
};

// Approval actions
export const APPROVAL_ACTIONS = {
  APPROVE: 'approved',
  REJECT: 'rejected',
  REQUEST_REVISION: 'request_revision',
};

// Priority levels
export const PRIORITY_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
};

// Notification types
export const NOTIFICATION_TYPES = {
  APPROVAL: 'approval',
  ALERT: 'alert',
  REMINDER: 'reminder',
  INFO: 'info',
  SYSTEM: 'system',
};

// Time constants
export const TIME_CONSTANTS = {
  HOURS_PER_DAY: 8,
  WORK_DAYS_PER_WEEK: 5,
  WORK_WEEKS_PER_MONTH: 4,
  APPROVAL_TIMEOUT_HOURS: 24,
  SESSION_TIMEOUT_MINUTES: 30,
};

// Validation constants
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    MESSAGE: 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s'-]+$/,
    MESSAGE: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  },
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 5000,
  },
  HOURS_WORKED: {
    MIN: 0.5,
    MAX: 24,
    STEP: 0.5,
  },
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY_DATE: 'MMM dd, yyyy',
  DISPLAY_DATETIME: 'MMM dd, yyyy, hh:mm a',
  DISPLAY_TIME: 'hh:mm a',
  API_DATE: 'yyyy-MM-dd',
  API_DATETIME: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  INPUT_DATE: 'YYYY-MM-DD',
  INPUT_DATETIME: 'YYYY-MM-DDTHH:mm',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [5, 10, 25, 50, 100],
  DEFAULT_PAGE: 1,
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'workflow_token',
  REFRESH_TOKEN: 'workflow_refresh_token',
  USER_DATA: 'workflow_user_data',
  SETTINGS: 'workflow_settings',
  RECENT_SEARCHES: 'workflow_recent_searches',
  THEME: 'workflow_theme',
  LANGUAGE: 'workflow_language',
};

// Theme constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Color constants for priority levels
export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.CRITICAL]: {
    bg: 'bg-red-500',
    text: 'text-red-800',
    light: 'bg-red-100',
    border: 'border-red-200',
  },
  [PRIORITY_LEVELS.HIGH]: {
    bg: 'bg-amber-500',
    text: 'text-amber-800',
    light: 'bg-amber-100',
    border: 'border-amber-200',
  },
  [PRIORITY_LEVELS.MEDIUM]: {
    bg: 'bg-blue-500',
    text: 'text-blue-800',
    light: 'bg-blue-100',
    border: 'border-blue-200',
  },
  [PRIORITY_LEVELS.LOW]: {
    bg: 'bg-gray-500',
    text: 'text-gray-800',
    light: 'bg-gray-100',
    border: 'border-gray-200',
  },
};

// Color constants for status
export const STATUS_COLORS = {
  [WORK_ENTRY_STATUS.DRAFT]: {
    bg: 'bg-gray-500',
    text: 'text-gray-800',
    light: 'bg-gray-100',
  },
  [WORK_ENTRY_STATUS.PENDING]: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-800',
    light: 'bg-yellow-100',
  },
  [WORK_ENTRY_STATUS.APPROVED]: {
    bg: 'bg-green-500',
    text: 'text-green-800',
    light: 'bg-green-100',
  },
  [WORK_ENTRY_STATUS.REJECTED]: {
    bg: 'bg-red-500',
    text: 'text-red-800',
    light: 'bg-red-100',
  },
  [WORK_ENTRY_STATUS.REVISED]: {
    bg: 'bg-blue-500',
    text: 'text-blue-800',
    light: 'bg-blue-100',
  },
};

// Notification category icons
export const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.APPROVAL]: 'CheckCircle',
  [NOTIFICATION_TYPES.ALERT]: 'AlertCircle',
  [NOTIFICATION_TYPES.REMINDER]: 'Clock',
  [NOTIFICATION_TYPES.INFO]: 'Info',
  [NOTIFICATION_TYPES.SYSTEM]: 'Bell',
};

// Dashboard stats icons
export const STATS_ICONS = {
  PENDING_APPROVALS: 'Clock',
  TOTAL_HOURS: 'BarChart3',
  TEAM_MEMBERS: 'Users',
  COMPLETION_RATE: 'TrendingUp',
  REJECTED_WORK: 'XCircle',
  AVG_APPROVAL_TIME: 'Zap',
};

// Export all constants
export default {
  API_ENDPOINTS,
  USER_ROLES,
  WORK_ENTRY_STATUS,
  APPROVAL_ACTIONS,
  PRIORITY_LEVELS,
  NOTIFICATION_TYPES,
  TIME_CONSTANTS,
  VALIDATION_RULES,
  DATE_FORMATS,
  PAGINATION,
  STORAGE_KEYS,
  THEMES,
  PRIORITY_COLORS,
  STATUS_COLORS,
  NOTIFICATION_ICONS,
  STATS_ICONS,
};