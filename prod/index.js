"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const server_1 = __importDefault(require("./server"));
const server = new server_1.default();
const cwd = process.cwd();
console.log(cwd);
server.app.get('/', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../", "index.html"));
});
server.connect();
process.on("SIGINT", function () {
    server.stop();
    process.exit(0);
});
