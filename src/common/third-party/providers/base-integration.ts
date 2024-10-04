import { ProviderConfig, ProviderGroup, ProviderMember } from '../interfaces';

export abstract class BaseIntegrationProvider<T = any> {
  public integrationName: string;
  protected baseClient: T;

  constructor(name: string) {
    this.integrationName = name;
  }
  abstract connect(config: ProviderConfig): Promise<T>;
  abstract getConfig(payload: any): Promise<ProviderConfig>;
  abstract getIntegrationUri(payload: any): string;
  abstract getGroups(payload: ProviderConfig): Promise<Array<ProviderGroup>>;
  abstract getMembers(payload: ProviderConfig): Promise<Array<ProviderMember>>;
  abstract groupMembers(
    config: ProviderConfig,
    groupId: string,
  ): Promise<Array<ProviderMember>>;
}
