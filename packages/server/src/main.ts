import { json, text } from 'body-parser';
import { errors } from 'celebrate';
import express from 'express';
import proxy, { createProxyMiddleware } from 'http-proxy-middleware';

import DiscogsClient from './clients/discogs/discogs';
import ElasticSearchClient from './clients/elasticsearch/client';
import SearchJobController from './controller/search-job-controller';
import logger from './logger';
import { QueueService } from './services/queue-service';

const DISCOGS_TOKEN = 'ThagzNtHYHptDqbzRxCsJCvCjCeFIgZuGTZROBej';
const ELASTICSEARCH_HOST_URL = 'http://localhost:9200';
const ELASTIC_INDEX = 'lazydigger';
const REDIS_URL = 'redis://127.0.0.1:6379';
const PORT = '8888';

const options: proxy.Options = {
  target: ELASTICSEARCH_HOST_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    const { body } = req;
    if (body) {
      if (typeof body === 'object') {
        proxyReq.write(JSON.stringify(body));
      } else {
        proxyReq.write(body);
      }
    }
  },
};

function createAPIRouter({ queueService }: { queueService: QueueService }) {
  const router = express.Router();

  router.use(SearchJobController.basePath, new SearchJobController({ queueService }).router);

  return router;
}

function createServer({ queueService }: { queueService: QueueService }) {
  const app = express();

  app.use(json());
  app.use(text({ type: 'application/x-ndjson' }));

  app.use('/api', createAPIRouter({ queueService }));
  app.use('/*', createProxyMiddleware(options)); // proxy for elastic search

  app.use(errors());

  app.listen(PORT, () => {
    logger.info(`Express server listening on port ${PORT}`);
  });
}

async function main() {
  const discogsClient = new DiscogsClient(DISCOGS_TOKEN);
  const elasticSearchClient = new ElasticSearchClient(ELASTICSEARCH_HOST_URL, ELASTIC_INDEX);

  await elasticSearchClient.createIndexIfNotExist();

  const queueService = new QueueService({
    url: REDIS_URL,
    discogsClient,
    elasticSearchClient,
  })
    .create()
    .start();

  createServer({ queueService });
}

main().catch((err) => console.error(err));
