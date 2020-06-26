import path from "path";
import bodyParser from "body-parser";
import express, { Express } from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import env, { Env } from './env';
import to from './util/to';
import MaterialSchema from "./material-schema";
import * as MaterialMethods from './material-methods';


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
  connect(){
    mongoose.connect(env.CONNECTION_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			auth: {
				user: env.USER,
				password: env.PASSWORD,
			},
		});
		this.db = mongoose.connection;
		this.db.on("error", function (err) {
			console.log(
				"Mongoose default connection has occured " + err + " error"
			);
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
    this.app.use(express.static(path.join(process.cwd(), 'public')));
    this.app.get('/api/material/all', MaterialMethods.getAll);
    this.app.get('/api/material/find', MaterialMethods.find);
  }
  start() {
    if (!this.started) {
      this.app.listen(env.PORT, env.HOST, () => {
        console.log("http://%s:%s", env.HOST, env.PORT);
      });
    }
  }

  stop() {
    this.db.close(() => {
      console.log("connection disconnected");
    });			
	}
}

export default Server;