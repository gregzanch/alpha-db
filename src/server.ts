import path from "path";
import bodyParser from "body-parser";
import express, { Express } from "express";
import mongoose from "mongoose";
import fetch from "node-fetch";
import env, { Env } from './env';
import to from './util/to';
import MaterialSchema from "./schema/material-schema";



export interface ServerProps {
  name?: string;
}

export class Server {
  app: Express;
  db!: mongoose.Connection;
  constructor(props?: ServerProps) {
    this.app = express();
    this.connect = this.connect.bind(this);
    this.onceOpen = this.onceOpen.bind(this);
    this.stop = this.stop.bind(this);

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

		this.db.once("open", this.onceOpen);
  }
  private onceOpen() {
    const Material = mongoose.model("Material", MaterialSchema);
    
    this.app.get('/api/alpha/material/all', async (req, res) => {
      const query = Material.find({});
      var [err, docs] = await to(query.exec());
      if (err) {
        res.status(500).send("internal server error");
      }
      else {
        res.json(docs);
      }
    });
    
    this.app.listen(env.PORT, env.HOST, () => {
		  console.log("http://%s:%s", env.HOST, env.PORT);
	  });
  }

  stop() {
    this.db.close(() => {
      console.log("connection disconnected");
    });			
	}
}

export default Server;