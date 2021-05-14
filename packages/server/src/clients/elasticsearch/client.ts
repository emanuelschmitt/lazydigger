import { Client } from 'elasticsearch';

import { ReleaseResponse } from '../discogs/discogs-types';

const INDEX = 'lazydigger';

export default class ElasticSearchClient {
  private client: Client;
  private index: string;

  constructor(host: string, index: string) {
    this.client = new Client({
      hosts: [host],
    });
    this.index = index;
  }

  public async createIndexIfNotExist() {
    const indexExists = await this.client.indices.exists({
      index: this.index,
    });

    if (!indexExists) {
      await this.client.indices.create({
        index: this.index,
      });
    }

    await this.client.indices.putMapping({
      index: this.index,
      type: 'release',
      body: {
        properties: {
          genres: {
            type: 'keyword',
          },
          styles: {
            type: 'keyword',
          },
          country: {
            type: 'keyword'
          },
        },
      },
      includeTypeName: true,
    });
  }

  public async ping() {
    return this.client.ping({
      requestTimeout: 30000,
    });
  }

  public indexRelease(releaseData: ReleaseResponse) {
    const id = String(releaseData.id);
    return this.client.index({
      index: this.index,
      id: id,
      type: 'release',
      body: releaseData,
    });
  }

  public search() {
    return this.client.search({});
  }

  public getClient() {
    return this.client;
  }
}
