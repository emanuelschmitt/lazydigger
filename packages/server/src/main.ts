import { text } from 'body-parser';
import express from 'express';
import proxy, { createProxyMiddleware } from 'http-proxy-middleware';

import DiscogsClient from './clients/discogs/discogs';
import ElasticSearchClient from './clients/elasticsearch/client';
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
      // proxyReq.setHeader(
      //     'Authorization',
      //     `Basic ${btoa('cf7QByt5e:d2d60548-82a9-43cc-8b40-93cbbe75c34c')}`
      // );
      /* transform the req body back from text */
      const { body } = req;
      if (body) {
          if (typeof body === 'object') {
              proxyReq.write(JSON.stringify(body));
          } else {
              proxyReq.write(body);
          }
      }
  }
}

function createServer() {
  const app = express();

  app.use(text({ type: 'application/x-ndjson' }));

  app.use('*', createProxyMiddleware(options));

  app.listen(PORT, () => {
    logger.info(`Express server listening on port ${PORT}`);
  });

  logger.info(`Server started at http://0.0.0.0:${PORT}`);
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

  queueService.createJob({
    type: 'SEARCH_PAGE_COUNT',
    params: {
      search: {
        q: 'Roman Flügel',
        page: 1,
        per_page: 100,
      },
    },
  });

  createServer();
}

main().catch((err) => console.error(err));
