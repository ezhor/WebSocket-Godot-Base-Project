const WebSocket = require('ws');
const HttpsServer = require('https').createServer;
const fs = require("fs");

const server = HttpsServer({
    cert: fs.readFileSync("/etc/letsencrypt/live/b06facc6-22ef-4f39-bd22-884ad04bcaa4.clouding.host/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/b06facc6-22ef-4f39-bd22-884ad04bcaa4.clouding.host/privkey.pem")
})


const wss = new WebSocket.Server({ server: server });
const connections = []

console.log('WebSocket server is running on wss://localhost:8080');


wss.on('connection', (ws) => {
    connections.push(ws);
    console.log('New client connected');
    ws.send("identity@" + connections.length());

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`${message}`);
    });

    ws.on('close', () => {
        conections.splice(connections.indexOf(ws), 1);
        console.log('Client disconnected');
  });
});

server.listen(8080)
