import path from 'path';
import Server from './server';

const rootDir = process.cwd();

const server = new Server();


server.app.get('/', (req, res) => {
  res.sendFile(path.resolve(rootDir, "index.html"));
})

server.connect();

process.on("SIGINT", function () { 
  server.stop();
  process.exit(0);
});