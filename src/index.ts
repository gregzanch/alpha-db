import path from 'path';
import Server from './server';

const rootDir = process.cwd();

const server = new Server();

server.connect();
server.start();

process.on("beforeExit", server.stop);

