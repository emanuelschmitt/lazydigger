import { json } from 'body-parser';
import express from 'express';
import proxy from 'express-http-proxy';

import DiscogsClient from './clients/discogs/discogs';
import ElasticSearchClient from './clients/elasticsearch/client';
import logger from './logger';
import { QueueService } from './services/queue-service';

const DISCOGS_TOKEN = 'ThagzNtHYHptDqbzRxCsJCvCjCeFIgZuGTZROBej';
const ELASTICSEARCH_HOST_URL = 'http://localhost:9200';
const ELASTIC_INDEX = 'lazydigger';
const REDIS_URL = 'redis://127.0.0.1:6379';
const PORT = '8888';

function createServer() {
  const app = express();

  app.use(json());
  app.use('/search', proxy(ELASTICSEARCH_HOST_URL + '/' + ELASTIC_INDEX));

  app.listen(PORT, () => {
    logger.info(`Express server listening on port ${PORT}`);
  });

  logger.info(`Server started at http://0.0.0.0:${PORT}`);
}

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
    type: 'SEARCH_PAGE_COUNT',
    params: {
      search: {
        q: 'Traffic records',
        page: 1,
        per_page: 100,
      },
    },
  });

  createServer();
}

main().catch((err) => console.error(err));
