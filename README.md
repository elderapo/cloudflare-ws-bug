How to reproduce:
set `DOMAIN` in `.env`

```bash
yarn install
cloudflared --hostname DOMAIN --url 127.0.0.1 # replace DOMAIN with domain from .env
# wait for tunnel to start and estabilish
yarn start
```

Example output (replaced used domain with DOMAIN):

```
yarn run v1.6.0
$ node ./index.js
server is listening on 80


Sending request to: http(http://localhost)
HTTP host from headers localhost


Sending request to: http(https://DOMAIN)
HTTP host from headers DOMAIN


Sending request to: http(https://DOMAIN)
HTTP host from headers DOMAIN


Sending request to: ws(ws://localhost)
WS host from headers localhost:80


Sending request to: ws(wss://DOMAIN)
WS host from headers 127.0.0.1
AssertionError [ERR_ASSERTION]: ws(DOMAIN) should return "DOMAIN" but instead it returned "127.0.0.1" <--- "127.0.0.1" was set in cloudflared as --url
```
