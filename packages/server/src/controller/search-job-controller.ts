import { celebrate, Joi, Segments } from 'celebrate';
import express, { Request, Response } from 'express';
import { flatten } from 'lodash';

import { SearchParameters } from '../clients/discogs/discogs-types';
import { QueueService } from '../services/queue-service';

type SearchConfig = {
  type: 'release';
  year_from: number;
  year_to: number;
  genres: string[];
  styles: string[];
  countries: string[];
};

export const searchConfigSchema = Joi.object({
  type: Joi.string().allow('release').required(),
  year_from: Joi.number().required(),
  year_to: Joi.number().required(),
  genres: Joi.array().items(Joi.string().required()),
  styles: Joi.array().items(Joi.string()),
  countries: Joi.array().items(Joi.string()),
});

export function range(from: number, to: number): number[] {
  return [...Array(Math.abs(to - from)).keys()].map((i) => i + from);
}

export function product(...sets: any[]) {
  return sets.reduce((acc: any[], set: any[]) => flatten(acc.map((x) => set.map((y) => [...x, y]))), [[]]);
}

export default class SearchJobController {
  public router = express.Router();
  private queueService: QueueService;
  public static basePath = '/search-job';

  constructor({ queueService }: { queueService: QueueService }) {
    this.queueService = queueService;

    this.router.post(
      '/',
      celebrate({
        [Segments.BODY]: searchConfigSchema,
      }),
      this.postSearchConfig,
    );
  }

  private postSearchConfig = (request: Request<SearchParameters>, response: Response<{ message: string }>) => {
    const searchConfig = request.body as SearchConfig;
    const searchParamsCollection = this.combineSearchConfigs(searchConfig);

    for (const searchParams of searchParamsCollection) {
      this.queueService.createJob({
        type: 'SEARCH_PAGE_COUNT',
        params: {
          search: searchParams,
        },
      });
    }

    response.status(200).send({ message: 'ok' });
  };

  public combineSearchConfigs({ year_from, year_to, genres, countries }: SearchConfig): SearchParameters[] {
    const years = range(year_from, year_to);
    const combinations = product(years, genres, countries);

    const permutations: SearchParameters[] = [];
    for (const combination of combinations) {
      const [year, genre, country] = combination;
      permutations.push({ page: 1, per_page: 100, year, genre, country });
    }

    return permutations;
  }
}
