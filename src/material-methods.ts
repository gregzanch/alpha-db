import { Express, Request, Response } from "express";
import mongoose from "mongoose";
import to from "./util/to";
import MaterialSchema from "./material-schema";

const Material = mongoose.model("Material", MaterialSchema);

export async function getAll(req: Request, res: Response) {
  const query = Material.find({});
  const [err, docs] = await to(query.exec());
  if (err) {
  res.status(500).send("internal server error");
  } else {
  res.json(docs);
  }
}

export async function find(req: Request, res: Response) {
  const skip = (req.query["skip"] && parseInt(req.query["skip"] as string)) || 0;
  const limit = (req.query["limit"] && parseInt(req.query["limit"] as string)) || 30;
  const exact = req.query["exact"] && Boolean(req.query["exact"]) || false; 
  // const description = req.query["description"] || false;
  // const tags = req.query['tags'] || [];
  // const name = req.query["name"] || "";
  console.log(req.query);
  const obj = req.query['obj'] || "{}";
  
  const options = JSON.parse(obj as string);
  
  
  console.log(options)
  
  const query = Material.find(options).skip(skip).limit(limit);
  
  const [err, docs] = await to(query.exec());
  if (err) {
    res.status(500).send("internal server error");
  } else {
    res.json(docs);
  }
}



export async function getBrief(req: Request, res: Response) {
  const query = Material.find({}).select("description");
  const [err, docs] = await to(query.exec());
  if (err) {
  res.status(500).send("internal server error");
  } else {
  res.json(docs);
  }
}