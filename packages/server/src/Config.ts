export class Config {
  public static getAsString(key: string, fallback?: string): string {
    if (process.env[key] !== undefined) {
      return process.env[key];
    } else {
      return fallback;
    }
  }

  public static getAsNumber(key: string, fallback?: number): number {
    if (process.env[key] !== undefined) {
      try {
        return Number(process.env[key] || fallback);
      } catch (err) {
        console.warn(err);
      }
    } else {
      return fallback;
    }

    return fallback;
  }

  public static getAsBoolean(key: string, fallback?: boolean): boolean {
    if (process.env[key] !== undefined) {
      return process.env[key] === 'true' || process.env[key] === 'True';
    } else {
      return fallback;
    }
  }
}
