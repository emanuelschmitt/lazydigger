import { Client } from "elasticsearch";
import DiscogsClient from "./clients/discogs/discogs";
import { QueueService } from "./services/queue-service";

const DISCOGS_TOKEN = "ThagzNtHYHptDqbzRxCsJCvCjCeFIgZuGTZROBej";
const REDIS_URL = "redis://127.0.0.1:6379";

async function createIndexIfExists(client: Client, indexName: string) {
  const indexExists = await client.indices.exists({
    index: indexName,
  });

  if (indexExists) {
    return;
  }

  await client.indices.create({
    index: indexName,
  });
}

async function main() {
  const elasticSearchClient = new Client({
    hosts: ["http://localhost:9200"],
  });
  await elasticSearchClient.ping({
    requestTimeout: 30000,
  });
  await createIndexIfExists(elasticSearchClient, "lazydigger.releases");

  const discogsClient = new DiscogsClient(DISCOGS_TOKEN);
  const queueService = new QueueService({
    url: REDIS_URL,
    discogsClient,
  })
    .create()
    .start();

  queueService.createJob({
    type: "SEARCH_PAGE_COUNT",
    params: {
      search: {
        q: "Guy named",
        page: 1,
        per_page: 100,
      },
    },
  });
}

main().catch((err) => console.error(err));
