const WebSocket = require('ws');
const HttpsServer = require('https').createServer;
const fs = require("fs");

const server = HttpsServer({
    cert: fs.readFileSync("/etc/letsencrypt/live/b06facc6-22ef-4f39-bd22-884ad04bcaa4.clouding.host/fullchain.pem"),
    key: fs.readFileSync("/etc/letsencrypt/live/b06facc6-22ef-4f39-bd22-884ad04bcaa4.clouding.host/privkey.pem")
})


const wss = new WebSocket.Server({ server: server });
const connections = new Array(20).fill(null);

console.log('WebSocket server is running on wss://localhost:8080');


wss.on('connection', (ws) => {
    var identity = connections.indexOf(null);
    connections[identity] = ws;

    console.log('New client connected with id: ' + identity);
    ws.send("server@identity@" + identity);

    for(var i=0; i < connections.length; i++){
        if(i != identity){
            if(connections[i] != null){
                ws.send("server@enemy@" + i);
                connections[i].send("server@enemy@" + identity);
            }
        }
    }

    ws.on('message', (message) => {
        for(var i=0; i < connections.length; i++){
            if(connections[i] != null && i != identity){
                connections[i].send("" + message);
            }
        }
    });

    ws.on('close', () => {
        var identity = connections.indexOf(ws)        
        connections[identity] = null;
        for(var i=0; i < connections.length; i++){
            if(connections[i] != null){
                connections[i].send("server@enemy@" + identity + "@destroy");
            }
        }        
        console.log('Client disconnected with id: ' + identity);
  });
});

server.listen(8080)
