import mongoose from "mongoose";
import dotenv from "dotenv";
import MaterialSchema from './schema/material-schema.js';
dotenv.config();


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


mongoose.connection.on("error", console.error.bind(console, "connection error:"));

mongoose.connection.on("connected", function () {
	console.log("Mongoose default connection is open");
});

mongoose.connection.on("disconnected", function () {
  console.log("Mongoose default connection is disconnected");
});

mongoose.connection.on("error", function (err) {
	console.log("Mongoose default connection has occured " + err + " error");
});


mongoose.connection.once("open", function () {
	const Material = mongoose.model("Material", MaterialSchema);

	Material.findOne(
		{ name: "Concrete Or Terrazzo Floor" },
		"nrc absorption",
		function (err, mat) {
      if (err) return err;
			console.log(mat);
		}
	);
});


process.on("SIGINT", function () {
	mongoose.connection.close(function () {
		console.log("Mongoose default connection is disconnected due to application termination");
		process.exit(0);
	});
});