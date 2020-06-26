"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./env"));
const to_1 = __importDefault(require("./util/to"));
const material_schema_1 = __importDefault(require("./schema/material-schema"));
class Server {
    constructor(props) {
        this.app = express_1.default();
        this.connect = this.connect.bind(this);
        this.onceOpen = this.onceOpen.bind(this);
        this.stop = this.stop.bind(this);
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
        this.db.once("open", this.onceOpen);
    }
    onceOpen() {
        const Material = mongoose_1.default.model("Material", material_schema_1.default);
        this.app.get('/api/alpha/material/all', async (req, res) => {
            const query = Material.find({});
            var [err, docs] = await to_1.default(query.exec());
            if (err) {
                res.status(500).send("internal server error");
            }
            else {
                res.json(docs);
            }
        });
        this.app.listen(env_1.default.PORT, env_1.default.HOST, () => {
            console.log("http://%s:%s", env_1.default.HOST, env_1.default.PORT);
        });
    }
    stop() {
        this.db.close(() => {
            console.log("connection disconnected");
        });
    }
}
exports.Server = Server;
exports.default = Server;
