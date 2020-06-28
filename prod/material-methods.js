"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrief = exports.find = exports.getAll = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const to_1 = __importDefault(require("./util/to"));
const material_schema_1 = __importDefault(require("./material-schema"));
const Material = mongoose_1.default.model("Material", material_schema_1.default);
async function getAll(req, res) {
    const query = Material.find({});
    const [err, docs] = await to_1.default(query.exec());
    if (err) {
        res.status(500).send("internal server error");
    }
    else {
        res.json(docs);
    }
}
exports.getAll = getAll;
async function find(req, res) {
    const skip = (req.query["skip"] && parseInt(req.query["skip"])) || 0;
    const limit = (req.query["limit"] && parseInt(req.query["limit"])) || 30;
    const exact = req.query["exact"] && Boolean(req.query["exact"]) || false;
    // const description = req.query["description"] || false;
    // const tags = req.query['tags'] || [];
    // const name = req.query["name"] || "";
    console.log(req.query);
    const obj = req.query['obj'] || "{}";
    const options = JSON.parse(obj);
    console.log(options);
    const query = Material.find(options).skip(skip).limit(limit);
    const [err, docs] = await to_1.default(query.exec());
    if (err) {
        res.status(500).send("internal server error");
    }
    else {
        res.json(docs);
    }
}
exports.find = find;
async function getBrief(req, res) {
    const query = Material.find({}).select("description");
    const [err, docs] = await to_1.default(query.exec());
    if (err) {
        res.status(500).send("internal server error");
    }
    else {
        res.json(docs);
    }
}
exports.getBrief = getBrief;
