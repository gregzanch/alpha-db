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
  const query = Material.find(req.query);
  const [err, docs] = await to(query.exec());
  if (err) {
    res.status(500).send("internal server error");
  } else {
    res.json(docs);
  }
}

