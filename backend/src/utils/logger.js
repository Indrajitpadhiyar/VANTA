/**
 * Custom High-Performance Structured Logger
 * Provides formatted console outputs with timestamps, log levels, and ANSI styling.
 */

const ANSI_COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  gray: '\x1b[90m',
};

const formatTimestamp = () => new Date().toISOString();

export const logger = {
  info: (message, meta = '') => {
    console.log(
      `${ANSI_COLORS.gray}[${formatTimestamp()}]${ANSI_COLORS.reset} ` +
      `${ANSI_COLORS.cyan}[INFO]${ANSI_COLORS.reset} ${message}`,
      meta ? meta : ''
    );
  },

  success: (message, meta = '') => {
    console.log(
      `${ANSI_COLORS.gray}[${formatTimestamp()}]${ANSI_COLORS.reset} ` +
      `${ANSI_COLORS.green}[SUCCESS]${ANSI_COLORS.reset} ${message}`,
      meta ? meta : ''
    );
  },

  warn: (message, meta = '') => {
    console.warn(
      `${ANSI_COLORS.gray}[${formatTimestamp()}]${ANSI_COLORS.reset} ` +
      `${ANSI_COLORS.yellow}[WARN]${ANSI_COLORS.reset} ${message}`,
      meta ? meta : ''
    );
  },

  error: (message, error = '') => {
    console.error(
      `${ANSI_COLORS.gray}[${formatTimestamp()}]${ANSI_COLORS.reset} ` +
      `${ANSI_COLORS.red}[ERROR]${ANSI_COLORS.reset} ${message}`,
      error ? error : ''
    );
  },

  debug: (message, meta = '') => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        `${ANSI_COLORS.gray}[${formatTimestamp()}]${ANSI_COLORS.reset} ` +
        `${ANSI_COLORS.magenta}[DEBUG]${ANSI_COLORS.reset} ${message}`,
        meta ? meta : ''
      );
    }
  },

  http: (method, path, status, durationMs) => {
    const statusColor =
      status >= 500
        ? ANSI_COLORS.red
        : status >= 400
        ? ANSI_COLORS.yellow
        : status >= 300
        ? ANSI_COLORS.cyan
        : ANSI_COLORS.green;

    console.log(
      `${ANSI_COLORS.gray}[${formatTimestamp()}]${ANSI_COLORS.reset} ` +
      `${ANSI_COLORS.bright}[HTTP]${ANSI_COLORS.reset} ` +
      `${method.toUpperCase()} ${path} -> ${statusColor}${status}${ANSI_COLORS.reset} ` +
      `(${durationMs}ms)`
    );
  },
};
