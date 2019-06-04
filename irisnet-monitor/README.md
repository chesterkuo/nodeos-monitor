run docker with network set to host

```
docker run -it --network="host" --rm maiwj/curl:latest bash
bash-4.3# curl http://localhost:26657/status
```
