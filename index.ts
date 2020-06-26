import path from 'path';
import Server from './src/server';

const server = new Server();

server.app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
})

server.connect();

process.on("SIGINT", function () { 
  server.stop();
  process.exit(0);
});