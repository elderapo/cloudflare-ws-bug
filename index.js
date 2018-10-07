require("dotenv").config();
const http = require("http");
const WebSocket = require("ws");
const rp = require("request-promise");
const assert = require("assert");

const port = 80;
const domain = process.env.DOMAIN;

const httpServer = http.createServer((req, res) => {
  console.log("HTTP host from headers", req.headers.host);
  return res.end(req.headers.host);
});

const websocketServer = new WebSocket.Server({ server: httpServer });

websocketServer.on("connection", (ws, req) => {
  console.log("WS host from headers", req.headers.host);
  ws.send(req.headers.host);
});

httpServer.listen(port, err => {
  if (err) {
    return console.error(err);
  }

  console.log(`server is listening on ${port}`);
  test();
});

const testHTTP = async url => {
  console.log(`Sending request to: http(${url})`);
  return await rp.get(url);
};

const testWS = url => {
  console.log(`Sending request to: ws(${url})`);
  const ws = new WebSocket(url);

  return new Promise(resolve => {
    ws.on("open", function open() {
      ws.on("message", function incoming(data) {
        return resolve(data);
      });
    });
  });
};

const test = async () => {
  console.log("\n");

  {
    const res = await testHTTP(`http://localhost`);

    assert(
      res === "localhost",
      `get(localhost) should return "localhost" but instead it returned "${res}"`
    );
  }

  console.log("\n");

  {
    const res = await testHTTP(`https://${domain}`);

    assert(
      res === domain,
      `get(${domain}) should return "${domain}" but instead it returned "${res}"`
    );
  }

  console.log("\n");

  {
    const res = await testHTTP(`https://${domain}`);

    assert(
      res === domain,
      `get(${domain}) should return "${domain}" but instead it returned "${res}"`
    );
  }

  console.log("\n");

  {
    const res = await testWS("ws://localhost");
    assert(
      res === "localhost:80",
      `ws(localhost:80) should return "localhost:80" but instead it returned "${res}"`
    );
  }

  console.log("\n");

  {
    const res = await testWS(`wss://${domain}`);
    assert(
      res === domain,
      `ws(${domain}) should return "${domain}" but instead it returned "${res}"`
    );
  }
};
