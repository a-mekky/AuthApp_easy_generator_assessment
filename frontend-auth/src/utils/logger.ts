interface Logger {
  readonly isProduction: boolean;
  debug: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export const logger: Logger = {
  isProduction: import.meta.env.PROD as boolean,

  debug(...args: unknown[]): void {
    if (!this.isProduction) {
      console.log(...args);
    }
  },

  warn(...args: unknown[]): void {
    console.warn(...args);
  },

  error(...args: unknown[]): void {
    if (!this.isProduction) {
    console.error(...args);
    }
  },
};
