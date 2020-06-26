import mongoose from "mongoose";
import * as fs from 'fs';
import dotenv from 'dotenv';
import MaterialSchema from './schema/material-schema.js';

dotenv.config();

const mats = JSON.parse(fs.readFileSync('./material.json', 'utf8'));

mongoose.connect(
		"mongodb+srv://materialcluster-nnbwa.gcp.mongodb.net/material-db",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			auth: {
				user: process.env.USER,
				password: process.env.PASSWORD,
			},
		}
);
  
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {

	const Material = mongoose.model("Material", MaterialSchema);

  
	Material.insertMany(mats, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("almost done");
		}
		setTimeout(() => {
			db.close((err) => {
				if (err) {
					console.log(err);
				} else {
					console.log("closed");
				}
				process.exit(0);
			});
		}, 1000);
	});
	

	

  
	// Material.create(testmat, (err) => {
	// 	if (err) {
	// 		console.log("Material.create", err);
	// 		return err;
	// 	}
	// });

	// // or, for inserting large batches of documents
});