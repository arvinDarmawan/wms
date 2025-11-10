import * as dotenv from "dotenv";
dotenv.config();

class ConfigService {
  public getValue(key: string, throwOnMissing = true): string {
    const value = process.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
  }

  public isProduction(): boolean {
    const mode = this.getValue("NODE_ENV", false);
    return mode === "production";
  }

  public getPort(): number {
    return parseInt(this.getValue("PORT", false) || "3000", 10);
  }
}

// export a single instance for use across the app
export const configService = new ConfigService();
