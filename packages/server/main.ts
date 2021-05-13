import { Client } from "elasticsearch";

async function createIndexIfExists(client: Client, indexName: string) {
  const indexExists = await client.indices.exists({
    index: indexName,
  });

  if (indexExists) {
    return;
  }

  await client.indices.create({
    index: indexName,
  });
}

async function main() {
  const client = new Client({
    hosts: ["http://localhost:9200"],
  });

  await client.ping({
    requestTimeout: 30000,
  });

  await createIndexIfExists(client, "lazydigger.releases");
}

main().catch((err) => console.error(err));
