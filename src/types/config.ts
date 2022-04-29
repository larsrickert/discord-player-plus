export interface Config {
  app: {
    port: number;
  };
  log: {
    /** Max size of the log file in bytes */
    maxSize: number;
  };
}
