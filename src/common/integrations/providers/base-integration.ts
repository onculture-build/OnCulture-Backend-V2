import { ProviderConfig } from '../interfaces';

export abstract class BaseIntegrationProvider {
  public integrationName: string;

  constructor(name: string) {
    this.integrationName = name;
  }
  abstract connect<T = any>(config:ProviderConfig): Promise<T>;
  abstract getConfig(payload:any): Promise<ProviderConfig>;
}
