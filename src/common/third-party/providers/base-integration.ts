import { ProviderConfig } from '../interfaces';

export abstract class BaseIntegrationProvider<T = any> {
  public integrationName: string;
  protected baseClient: T;

  constructor(name: string) {
    this.integrationName = name;
  }
  abstract connect(config: ProviderConfig): Promise<T>;
  abstract getConfig(payload: any): Promise<ProviderConfig>;
  abstract getIntegrationUri(payload: any): string;
}
