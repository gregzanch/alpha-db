"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./env"));
const MaterialMethods = __importStar(require("./material-methods"));
class Server {
    constructor(props) {
        this.app = express_1.default();
        this.connect = this.connect.bind(this);
        this.setEndpoints = this.setEndpoints.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.started = false;
    }
    connect() {
        mongoose_1.default.connect(env_1.default.CONNECTION_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auth: {
                user: env_1.default.USER,
                password: env_1.default.PASSWORD,
            },
        });
        this.db = mongoose_1.default.connection;
        this.db.on("error", function (err) {
            console.log("Mongoose default connection has occured " + err + " error");
        });
        this.db.on("connected", function () {
            console.log("Mongoose default connection is open");
        });
        this.db.on("disconnected", function () {
            console.log("Mongoose default connection is disconnected");
        });
        this.db.once("open", this.setEndpoints);
    }
    setEndpoints() {
        this.app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
        this.app.get('/api/material/all', MaterialMethods.getAll);
        this.app.get('/api/material/find', MaterialMethods.find);
    }
    start() {
        if (!this.started) {
            this.app.listen(env_1.default.PORT, env_1.default.HOST, () => {
                console.log("http://%s:%s", env_1.default.HOST, env_1.default.PORT);
            });
        }
    }
    stop() {
        this.db.close(() => {
            console.log("connection disconnected");
        });
    }
}
exports.Server = Server;
exports.default = Server;
