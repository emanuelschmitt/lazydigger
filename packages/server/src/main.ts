import path from 'path';

import { json, text } from 'body-parser';
import { errors } from 'celebrate';
import express, { static as statics } from 'express';
import proxy, { createProxyMiddleware } from 'http-proxy-middleware';

import DiscogsClient from './clients/discogs/discogs';
import ElasticSearchClient from './clients/elasticsearch/client';
import configuration from './configuration';
import SearchJobController from './controller/search-job-controller';
import logger from './logger';
import { QueueService } from './services/queue-service';

const options: proxy.Options = {
  target: configuration.ELASTICSEARCH_HOST_URL,
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
  app.use(statics(path.resolve(__dirname, '../../app/build')));

  app.use('/api', createAPIRouter({ queueService }));
  app.use('/*', createProxyMiddleware(options)); // proxy for elastic search

  app.use(errors());

  app.listen(configuration.PORT, () => {
    logger.info(`Express server listening on port ${configuration.PORT}`);
  });
}

async function main() {
  const discogsClient = new DiscogsClient(configuration.DISCOGS_TOKEN);
  const elasticSearchClient = new ElasticSearchClient(
    configuration.ELASTICSEARCH_HOST_URL,
    configuration.ELASTIC_INDEX,
  );

  await elasticSearchClient.createIndexIfNotExist();

  const queueService = new QueueService({
    url: configuration.REDIS_URL,
    discogsClient,
    elasticSearchClient,
  })
    .create()
    .start();

  createServer({ queueService });
}

main().catch((err) => console.error(err));
