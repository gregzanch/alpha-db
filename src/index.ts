import path from 'path';
import Server from './server';

const server = new Server();

const root = process.cwd();

server.app.get('/', (req, res) => {
  res.sendFile(path.resolve(root, "index.html"));
})

server.connect();

process.on("SIGINT", function () { 
  server.stop();
  process.exit(0);
});