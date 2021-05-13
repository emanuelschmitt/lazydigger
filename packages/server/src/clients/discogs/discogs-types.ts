export type SearchParameters = {
  q?: string;
  type?: string;
  title?: string;
  release_title?: string;
  credit?: string;
  artist?: string;
  label?: string;
  genre?: string;
  style?: string;
  country?: string;
  year?: string;
  format?: string;
  track?: string;
  submitter?: string;
  contributor?: string;
  page: number;
  per_page: number;
};

export type SearchResult = {
  user_data: {
    in_collection: boolean;
    in_wantlist: boolean;
  };
  community: {
    have: number;
    want: number;
  };
  catno: string;
  year: string;
  id: number;
  style: string[];
  thumb: string;
  title: string;
  label: string[];
  master_id: number;
  type: 'release' | 'master';
  format: string[];
  barcode: string[];
  master_url: string;
  genre: string[];
  country: string;
  uri: string;
  cover_image: string;
  resource_url: string;
};

export type SearchResponse = {
  pagination: {
    per_page: number;
    items: number;
    page: number;
    urls: {
      prev?: string;
      next?: string;
      first?: string;
    };
    pages: number;
  };
  results: SearchResult[];
};

export type Video = {
  duration: number;
  description: string;
  embed: boolean;
  uri: string;
  title: string;
};

type Track = {
  duration: string;
  position: string;
  type_: string;
  title: string;
};

type Artist = {
  name: string;
  resource_url: string;
  id: number;
};

type Image = {
  uri: string;
  type: 'PRIMARY' | 'SECONDARY';
};

type Label = {
  name: string;
  catno: string;
  entity_type: string;
  resource_url: string;
  id: number;
  entity_type_name: 'label';
};

type Rating = {
  count: number;
  average: number;
};

export type ReleaseResponse = {
  styles: string[];
  videos: Video[];
  labels: Label[];
  year: number;
  community: {
    status: string;
    rating: Rating;
    have: number;
    want: number;
  };
  images: Image[];
  artists: Artist[];
  id: number;
  artists_sort: string;
  genres: string[];
  num_for_sale: string;
  title: string;
  date_changed: string;
  master_id?: number;
  lowest_price: number;
  status: string;
  released_formatted: string;
  estimated_weight: number;
  master_url: string;
  released: string;
  date_added: string;
  tracklist: Track[];
  country: string;
  identifiers: any[];
  companies: any[];
  uri: string;
  formats: Format[];
  resource_url: string;
  data_quality: string;
};

type Format = {
  descriptions: string[];
  name: string;
  qty: number;
};

export type MasterResponse = {
  styles: string[];
  genres: string[];
  videos: Video[];
  num_for_sale: number;
  title: string;
  most_recent_release: number;
  main_release: number;
  main_release_url: string;
  uri: string;
  artists: Artist[];
  versions_url: string;
  data_quality: string;
  most_recent_release_url: string;
  year: number;
  images: Image[];
  resource_url: string;
  lowest_price: number;
  id: number;
  tracklist: Track[];
};
