/**
 * Structured logging utility for Hacktrack MMU frontend
 * 
 * Uses wide events pattern: emit single, context-rich structured events
 * instead of scattered console.log statements.
 * 
 * In production, these logs are sent to the console in JSON format.
 * In development, they are pretty-printed for readability.
 */

interface LogContext {
  [key: string]: unknown;
}

interface LogEvent extends LogContext {
  timestamp: string;
  level: "info" | "error" | "warn";
  message: string;
  service?: string;
  component?: string;
  action?: string;
  userId?: string;
  requestId?: string;
  duration_ms?: number;
  url?: string;
  method?: string;
  status_code?: number;
  outcome?: "success" | "error";
  error?: {
    message: string;
    type?: string;
    stack?: string;
  };
}

const isProduction = process.env.NODE_ENV === "production";

/**
 * Generate a unique request ID for correlation
 */
function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Safely extract error information without exposing sensitive details
 */
function sanitizeError(error: unknown): { message: string; type?: string } {
  if (error instanceof Error) {
    return {
      message: error.message,
      type: error.name,
    };
  }
  if (typeof error === "string") {
    return { message: error };
  }
  return { message: "Unknown error occurred" };
}

/**
 * Emit a structured log event
 */
function emit(event: LogEvent): void {
  // In production, emit JSON for log aggregation
  // In development, use console methods for readability
  if (isProduction) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(event));
  } else {
    const { level, message, ...context } = event;
    const timestamp = new Date().toISOString();
    
    // eslint-disable-next-line no-console
    console[level](
      `[${timestamp}] [${level.toUpperCase()}] ${message}`,
      Object.keys(context).length > 0 ? context : ""
    );
  }
}

/**
 * Log an informational event
 */
export function info(message: string, context: LogContext = {}): void {
  emit({
    timestamp: new Date().toISOString(),
    level: "info",
    message,
    service: "hacktrack-frontend",
    ...context,
  });
}

/**
 * Log an error event with structured context
 */
export function error(message: string, errorObj: unknown, context: LogContext = {}): void {
  emit({
    timestamp: new Date().toISOString(),
    level: "error",
    message,
    service: "hacktrack-frontend",
    error: sanitizeError(errorObj),
    ...context,
  });
}

/**
 * Log a warning event
 */
export function warn(message: string, context: LogContext = {}): void {
  emit({
    timestamp: new Date().toISOString(),
    level: "warn",
    message,
    service: "hacktrack-frontend",
    ...context,
  });
}

/**
 * Create a wide event for API requests
 * 
 * Usage:
 *   const logApi = createApiLogger("SearchComponent", "searchMembers");
 *   const startTime = Date.now();
 *   try {
 *     const result = await apiCall();
 *     logApi.success("Search completed", startTime, { count: result.length });
 *   } catch (err) {
 *     logApi.failure("Search failed", err, startTime);
 *   }
 */
export function createApiLogger(component: string, action: string) {
  const requestId = generateRequestId();
  
  return {
    requestId,
    
    success: (message: string, startTime: number, context: LogContext = {}): void => {
      emit({
        timestamp: new Date().toISOString(),
        level: "info",
        message,
        service: "hacktrack-frontend",
        component,
        action,
        requestId,
        duration_ms: Date.now() - startTime,
        outcome: "success",
        ...context,
      });
    },
    
    failure: (message: string, errorObj: unknown, startTime: number, context: LogContext = {}): void => {
      emit({
        timestamp: new Date().toISOString(),
        level: "error",
        message,
        service: "hacktrack-frontend",
        component,
        action,
        requestId,
        duration_ms: Date.now() - startTime,
        outcome: "error",
        error: sanitizeError(errorObj),
        ...context,
      });
    },
  };
}

/**
 * Default logger instance
 */
export const logger = {
  info,
  error,
  warn,
  createApiLogger,
};

export default logger;
