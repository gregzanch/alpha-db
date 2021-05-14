import path from "path";
import bodyParser from "body-parser";
import express, { Express } from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import to from "./util/to";
import MaterialSchema from "./material-schema";
import * as MaterialMethods from "./material-methods";

require("dotenv").config();

export interface ServerProps {
  name?: string;
}

export class Server {
  app: Express;
  db!: mongoose.Connection;
  started: boolean;
  constructor(props?: ServerProps) {
    this.app = express();
    this.connect = this.connect.bind(this);
    this.setEndpoints = this.setEndpoints.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.started = false;
  }
  connect() {
    mongoose.connect(process.env.DB_CONNECTION_URL!, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: {
        user: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
      },
    });
    this.db = mongoose.connection;
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
  private setEndpoints() {
    this.app.use(express.static(path.join(process.cwd(), "public")));
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(process.cwd(), "public", "index.html"));
    });
    this.app.get("/api/material/all", MaterialMethods.getAll);
    this.app.get("/api/material/brief", MaterialMethods.getBrief);
    this.app.get("/api/material/find", MaterialMethods.find);
  }
  start() {
    if (!this.started) {
      this.app.listen(
        Number(process.env.DB_PORT)! || 5234,
        process.env.DB_HOST!,
        () => {
          console.log(
            "http://%s:%s",
            process.env.DB_HOST!,
            process.env.DB_PORT!
          );
        }
      );
    }
  }

  stop() {
    this.db.close(() => {
      console.log("connection disconnected");
    });
  }
}

export default Server;
