import axios, { AxiosResponse, AxiosInstance, AxiosError } from "axios";
import _get from "lodash/get";
import qs from "query-string";

import {
  ReleaseResponse,
  SearchParameters,
  SearchResponse,
} from "./discogs-types";

const DISCOGS_BASE_URL = `https://api.discogs.com/`;

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });

function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}

export default class DiscogsClient {
  private httpClient: AxiosInstance;

  constructor(discogsToken: string) {
    this.httpClient = axios.create({
      baseURL: DISCOGS_BASE_URL,
      headers: {
        Authorization: `Discogs token=${discogsToken}`,
      },
    });
  }

  private async getWithRetry<T = any>(path: string): Promise<AxiosResponse<T>> {
    try {
      return this.httpClient.get<T>(path);
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 429) {
        await delay(30 * 1000);
        return this.getWithRetry<T>(path);
      }
      throw error;
    }
  }

  public async getSearchPageCount(search: SearchParameters): Promise<number> {
    const data = await this.searchDatabase(search);
    const count = data?.pagination?.pages;
    if (!count) {
      throw new Error("could not retrieve pagination count");
    }
    return count;
  }

  public async searchDatabase(
    search: SearchParameters
  ): Promise<SearchResponse> {
    const query = qs.stringify(search);
    try {
      let response = await this.getWithRetry<SearchResponse>(
        `/database/search?${query}`
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  public async fetchImage(uri: string): Promise<ArrayBuffer> {
    const response = await axios.get<ArrayBuffer>(uri, {
      responseType: "arraybuffer",
    });
    return response.data;
  }

  public async fetchRelease(id: number): Promise<ReleaseResponse> {
    let response = await this.getWithRetry(`releases/${id}`);
    return response.data;
  }
}
