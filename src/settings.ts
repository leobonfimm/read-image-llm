export class Settings {
  public applicationPort(): number {
    const port = this.getEnvOrDefault("PORT", "3000");

    return Number(port);
  }

  private getEnvOrDefault(envName: string, defaultValue: string): string {
    return process.env[envName] ?? defaultValue;
  }
}
