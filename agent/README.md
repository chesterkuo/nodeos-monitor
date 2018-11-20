run nodeos agent:
```bash

docker run -d \
--restart always \
-e HOSTNAME='' \
-e INTERNAL=true \
-e HOST='' \
-e INTERVAL_SECONDS=1 \
-e DB_HOST="" \
-e DB_USER='' \
-e DB_PASSWORD='' \
-e DB_DATABASE="" \
-e DB_TABLE='' \
--network host \
deadlock/nodeos-agent

```
