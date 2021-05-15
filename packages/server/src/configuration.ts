import dotenv from 'dotenv';

type Required<T> = T extends object ? { [P in keyof T]-?: NonNullable<T[P]> } : T;

dotenv.config();

let path;
switch (process.env.NODE_ENV) {
  case 'test':
    throw new Error('not implemented');
  case 'production':
    path = `${__dirname}/../configs/environment/.env.production`;
    break;
  default:
    path = `${__dirname}/../configs/environment/.env.development`;
}

dotenv.config({ path: path });

const configuration = {
  DISCOGS_TOKEN: process.env.DISCOGS_TOKEN,
  ELASTICSEARCH_HOST_URL: process.env.ELASTICSEARCH_HOST_URL,
  ELASTIC_INDEX: process.env.ELASTIC_INDEX,
  REDIS_URL: process.env.REDIS_URL,
  PORT: process.env.PORT,
};

for (const [key, value] of Object.entries(configuration)) {
  if (!value) {
    throw new Error(`configuration ${key} is missing`);
  }
}

export default configuration as Required<typeof configuration>;
