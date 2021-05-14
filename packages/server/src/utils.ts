import { ReleaseResponse } from './clients/discogs/discogs-types';

export type Release = Omit<
  ReleaseResponse,
  | 'data_quality'
  | 'date_added'
  | 'companies'
  | 'estimated_weight'
  | 'artists_sort'
  | 'released_formatted'
  | 'tracklist'
  | 'identifiers'
  | 'formats'
> & {
  rareness: number; // ratio between want and have
  price: number; // lowest_price multiplied by 100 for eleastic search
  averageRating: number;
};

export function calculateRareness(want: number, have: number) {
  return (want / Math.max(1, have)) * 100;
}

export function responseToRelease(response: ReleaseResponse): Release {
  const {
    data_quality,
    date_added,
    companies,
    estimated_weight,
    artists_sort,
    released_formatted,
    tracklist,
    identifiers,
    formats,
    ...rest
  } = response;
  return {
    ...rest,
    rareness: calculateRareness(response.community.want, response.community.have),
    price: typeof response.lowest_price === 'number' ? response.lowest_price * 100 : response.lowest_price,
    averageRating: response.community.rating.average * 100,
  };
}
