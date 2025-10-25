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
    var identity = connections.length - 1
    console.log('New client connected: ' + identity);
    ws.send("server@identity@" + identity);

    for(var i; i < connections.length; i++){
        console.log("Trying to send to: " + i)
        if(i != identity){
            console.log("Sending to: " + i)
            ws.send("server@enemy@" + i);
            connections[i].send("server@enemy@" + identity);
        }
    }

    ws.on('message', (message) => {
        //console.log(`Received: ${message}`);
    });

    ws.on('close', () => {
        var identity = connections.indexOf(ws)
        connections.splice(identity, 1);
        console.log('Client disconnected: ' + identity);
  });
});

server.listen(8080)
