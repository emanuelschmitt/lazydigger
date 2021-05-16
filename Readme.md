# Install on Dokku

## Install plugins for dokku

Install redis plugin:
`sudo dokku plugin:install https://github.com/dokku/dokku-redis.git redis`

Install elasticsearch plugin:
`sudo dokku plugin:install https://github.com/dokku/dokku-elasticsearch.git elasticsearch`

https://dokku.com/docs~v0.21.4/deployment/application-deployment/

## Create and link

```
dokku apps:create lazydigger
dokku redis:create lazydigger
dokku redis:link lazydigger lazydigger
dokku elasticsearch:create lazydigger
Error will happen, read here https://github.com/dokku/dokku-elasticsearch/issues/72#issuecomment-510771763
dokku elasticsearch:link lazydigger lazydigger
```

## Ensure elasticsearch runs in single-node mode

Edit elasticsearch.yaml:

```
node.name: node-1
cluster.name: docker-cluster
network.host: 0.0.0.0
discovery.type: single-node
```
