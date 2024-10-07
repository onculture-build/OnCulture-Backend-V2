export interface SlackCredentials {}

export interface TeamCredentials {}

export interface WhatsappCredentials {}

export type CredentialsJson =
  | SlackCredentials
  | TeamCredentials
  | WhatsappCredentials;

export type GlobalCredentials = any;

export enum IntegrationProviders {
  WHATSAPP = 'whatsapp',
  SLACK = 'slack',
  TEAMS = 'teams',
}

export interface ProviderConfig {
  apiKey?: string;
  slackAccessToken?: string;
  slackTeamId?: string;
  botId?: string;
  name?: string;
}

export interface ProviderMember {
  email: string;
  firstName: string;
  image: string;
  id: string;
  lastName: string;
}

export interface ProviderGroup {
  id: string;
  name: string;
}
