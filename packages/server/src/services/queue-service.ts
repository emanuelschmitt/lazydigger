import Bull, { Job, Queue } from 'bull';

import DiscogsClient from '../clients/discogs/discogs';
import { SearchParameters } from '../clients/discogs/discogs-types';
import ElasticSearchClient from '../clients/elasticsearch/client';
import logger from '../logger';
import { responseToRelease } from '../utils';

type JobData =
  | {
      type: 'FETCH_RELEASE';
      params: { releaseId: number };
    }
  | {
      type: 'SEARCH_PAGE_COUNT';
      params: { search: SearchParameters };
    }
  | {
      type: 'SEARCH_PAGE';
      params: { search: SearchParameters };
    };

const QUEUE_NAME = 'lazydigger';

const log = logger.child({ module: 'queue-service' });

export class QueueService {
  private url: string;
  private queue?: Queue<JobData>;
  private discogsClient: DiscogsClient;
  private elasticSearchClient: ElasticSearchClient;

  constructor({
    discogsClient,
    elasticSearchClient,
    url,
  }: {
    discogsClient: DiscogsClient;
    elasticSearchClient: ElasticSearchClient;
    url: string;
  }) {
    this.url = url;
    this.discogsClient = discogsClient;
    this.elasticSearchClient = elasticSearchClient;
  }

  create(): this {
    this.queue = new Bull<JobData>(QUEUE_NAME, {
      redis: this.url,
      defaultJobOptions: {
        lifo: true, // We want the relases to be fetched first
      },
    });

    this.queue.on('active', (job) => {
      log.info(`Starting job ${job.id} of type ${job.data.type}`);
    });

    this.queue.on('failed', (job, error) => {
      log.info(`Job ${job.id} of type ${job.data.type} failed. ${error}`, job.stacktrace, error);
    });

    return this;
  }

  start(): this {
    if (!this.queue) {
      throw new Error('queue is not yet running. create queue before using');
    }

    this.queue.process(1, async (job, done) => {
      try {
        const data = job.data;

        if (data.type === 'SEARCH_PAGE_COUNT') {
          const pageCount = await this.discogsClient.getSearchPageCount(data.params.search);
          for (let i = 1; i < pageCount + 1; i++) {
            this.createJob({
              type: 'SEARCH_PAGE',
              params: {
                search: {
                  ...data.params.search,
                  ...{ page: i },
                },
              },
            });
          }
        }

        if (data.type === 'SEARCH_PAGE') {
          const response = await this.discogsClient.searchDatabase(data.params.search);
          for (const release of response.results) {
            if (release.community.have < 50) {
              return;
            }
            await this.createJob({
              type: 'FETCH_RELEASE',
              params: { releaseId: release.id },
            });
          }
        }

        if (data.type === 'FETCH_RELEASE') {
          const response = await this.discogsClient.fetchRelease(data.params.releaseId);
          const release = responseToRelease(response);
          await this.elasticSearchClient.indexRelease(release);
        }

        done();
      } catch (error) {
        done(error);
      }
    });

    return this;
  }

  createJob(jobData: JobData): Promise<Job<JobData>> {
    if (!this.queue) {
      throw new Error('queue is not yet running. create queue before using');
    }
    return this.queue.add(jobData);
  }
}
