run nodeos monitor:
```bash

docker run -d \
--restart always \
-e INTERVAL_SECONDS=60 \
-e DB_HOST='' \
-e DB_USER='' \
-e DB_PASSWORD='' \
-e DB_DATABASE="" \
-e DB_TABLE='' \
-e BOT_TOKEN='' \
-e CHANNEL='' \
-e NUM_DELTA=100 \
--network host \
deadlock/nodeos-monitor

```
