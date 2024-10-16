import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SanityClient } from '@sanity/client';

@Injectable()
export class SanityProviderService {
  constructor(readonly config: ConfigService) {}

  private client: SanityClient = createClient({
    projectId: this.config.get<string>('sanity.projectId'),
    dataset: this.config.get<string>('sanity.dataset'),
    apiVersion: this.config.get<string>('sanity.apiVersion'),
    useCdn: this.config.get<string>('environment') === 'production',
    token: this.config.get<string>('sanity.token'),
  });

  getContent<T>(query: string): Promise<T> {
    return this.client.fetch<T>(query);
  }
}
