import { WebSocketServer } from "ws";
import { v4 as uuid } from "uuid";
// import {writeFile} from "fs";

const messages = [];

const clients = {};
const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", (ws) => {
  const id = uuid();
  clients[id] = ws;

  console.log(`New client id ${id}`);

  ws.send(JSON.stringify(messages));

  ws.on("message", (rawMessage) => {
    const sendedMessage = rawMessage.toString("utf-8");

    const {name, message} = JSON.parse(sendedMessage);

    messages.push({name, message});

    const dataString = JSON.stringify([{name, message}]);

    for(const id in clients) {
      clients[id].send(dataString);
    }
  });

  ws.on("close", () => {
    delete clients[id];
    console.log(`Client is closed ${id}`);
  });
});

// process.on()
