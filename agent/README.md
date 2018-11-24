run nodeos agent:
```bash

docker run -d \
--restart always \
-e HOSTNAME='node' \
-e INTERNAL=true \
-e HOST='127.0.0.1:8888' \
-e INTERVAL_SECONDS=1 \
-e DB_HOST="" \
-e DB_USER='' \
-e DB_PASSWORD='' \
-e DB_DATABASE="" \
-e DB_TABLE='' \
--network host \
deadlock/nodeos-agent

```
