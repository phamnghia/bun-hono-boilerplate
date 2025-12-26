import { appConfig } from "../config/app";

type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (appConfig.isTest) return false;
    if (level === "debug" && !appConfig.isDevelopment) return false;
    return true;
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, meta));
    }
  }

  error(message: string, error?: Error | any, meta?: any): void {
    if (this.shouldLog("error")) {
      const errorMeta = error instanceof Error
        ? { ...meta, error: error.message, stack: error.stack }
        : { ...meta, error };
      console.error(this.formatMessage("error", message, errorMeta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog("debug")) {
      console.debug(this.formatMessage("debug", message, meta));
    }
  }
}

export const logger = new Logger();
