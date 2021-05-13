import { Client } from "elasticsearch";
import { ReleaseResponse } from "../discogs/discogs-types";

const INDEX = "lazydigger";

export default class ElasticSearchClient {
  private client: Client;
  constructor(host: string) {
    this.client = new Client({
      hosts: [host],
    });
  }

  public async createIndexIfNotExist() {
    const indexExists = await this.client.indices.exists({
      index: INDEX,
    });

    if (!indexExists) {
      await this.client.indices.create({
        index: INDEX,
      });
    }

    await this.client.indices.putMapping({
      index: INDEX,
      type: "release",
      body: {
        properties: {
          genres: {
            type: "keyword",
          },
          styles: {
            type: "keyword",
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
      index: "lazydigger",
      id: id,
      type: "release",
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
