export type ErrorCode = 
  | 'INVALID_URL'
  | 'USER_NOT_FOUND'
  | 'PROFILE_PRIVATE'
  | 'RATE_LIMITED'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'INSUFFICIENT_DATA'
  | 'NO_DATA_IN_RANGE'
  | 'UNKNOWN_ERROR';

export interface AppError {
  code: ErrorCode;
  message: string;
  suggestion?: string;
}

const errorMessages: Record<ErrorCode, { message: string; suggestion?: string }> = {
  INVALID_URL: {
    message: 'Invalid LeetCode URL',
    suggestion: 'Please provide a valid LeetCode profile URL (e.g., leetcode.com/username)'
  },
  USER_NOT_FOUND: {
    message: 'User not found',
    suggestion: 'We couldn\'t find a LeetCode user with that username. Please check and try again.'
  },
  PROFILE_PRIVATE: {
    message: 'Profile is private',
    suggestion: 'The LeetCode profile is private. We need public access to analyze it.'
  },
  RATE_LIMITED: {
    message: 'Too many requests',
    suggestion: 'We\'ve hit LeetCode\'s rate limit. Please try again in a few minutes.'
  },
  NETWORK_ERROR: {
    message: 'Connection error',
    suggestion: 'Unable to connect to our servers. Please check your internet connection.'
  },
  API_ERROR: {
    message: 'Analysis failed',
    suggestion: 'There was an issue processing the data. Please try again later.'
  },
  INSUFFICIENT_DATA: {
    message: 'Not enough data',
    suggestion: 'We need more problem solving history to generate this analysis.'
  },
  NO_DATA_IN_RANGE: {
    message: 'No activity found',
    suggestion: 'There is no LeetCode activity in the selected date range. Try expanding the dates.'
  },
  UNKNOWN_ERROR: {
    message: 'Something went wrong',
    suggestion: 'An unexpected error occurred. Please try again.'
  }
};

export function classifyError(error: unknown): AppError {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code as ErrorCode;
    if (errorMessages[code]) {
      return { code, ...errorMessages[code] };
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('network') || message.includes('fetch')) {
      return { code: 'NETWORK_ERROR', ...errorMessages['NETWORK_ERROR'] };
    }
    if (message.includes('404')) {
      return { code: 'USER_NOT_FOUND', ...errorMessages['USER_NOT_FOUND'] };
    }
    if (message.includes('429')) {
      return { code: 'RATE_LIMITED', ...errorMessages['RATE_LIMITED'] };
    }
  }

  return { code: 'UNKNOWN_ERROR', ...errorMessages['UNKNOWN_ERROR'] };
}
