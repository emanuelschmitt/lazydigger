import Bull, { Queue } from "bull";
import DiscogsClient from "../clients/discogs/discogs";

type JobData = {
  type: "FETCH_RELEASE";
  params: { releaseId: number };
};

const QUEUE_NAME = "lazydigger";

export class QueueService {
  private url: string;
  private queue?: Queue<JobData>;
  private discogsClient: DiscogsClient;

  constructor({
    discogsClient,
    url,
  }: {
    discogsClient: DiscogsClient;
    url: string;
  }) {
    this.url = url;
    this.discogsClient = discogsClient;
  }

  create(): this {
    this.queue = new Bull<JobData>(QUEUE_NAME, {
      redis: this.url,
    });
    return this;
  }

  start(): this {
    if (!this.queue) {
      throw new Error("queue is not yet running. create queue before using");
    }

    this.queue.process(async (job, done) => {
      const { type, params } = job.data as JobData;

      if (type === "FETCH_RELEASE") {
        const response = await this.discogsClient.fetchRelease(
          params.releaseId
        );
        console.log("response", response);
        done();
      }
    });

    return this;
  }

  createJob(jobData: JobData): this {
    if (!this.queue) {
      throw new Error("queue is not yet running. create queue before using");
    }
    this.queue.add(jobData);
    return this;
  }
}
