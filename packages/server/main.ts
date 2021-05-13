import DiscogsClient from "./clients/discogs/discogs";
import ElasticSearchClient from "./clients/elasticsearch/client";
import { QueueService } from "./services/queue-service";

const DISCOGS_TOKEN = "ThagzNtHYHptDqbzRxCsJCvCjCeFIgZuGTZROBej";
const ELASTICSEARCH_HOST_URL = "http://localhost:9200";
const REDIS_URL = "redis://127.0.0.1:6379";
const PORT = "8888";

async function main() {
  const discogsClient = new DiscogsClient(DISCOGS_TOKEN);
  const elasticSearchClient = new ElasticSearchClient(ELASTICSEARCH_HOST_URL);

  await elasticSearchClient.createIndexIfNotExist();

  const queueService = new QueueService({
    url: REDIS_URL,
    discogsClient,
    elasticSearchClient,
  })
    .create()
    .start();

  queueService.createJob({
    type: "SEARCH_PAGE_COUNT",
    params: {
      search: {
        q: "Traffic records",
        page: 1,
        per_page: 100,
      },
    },
  });
}

main().catch((err) => console.error(err));
