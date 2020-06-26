import mongoose from "mongoose";
import MaterialSchema from './schema/material-schema';
import env from '../env';


mongoose.connect(
	env.CONNECTION_URL,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		auth: {
			user: env.USER,
			password: env.PASSWORD,
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

	const query = Material.find({});
	var promise = query.exec();
	promise.then(doc=> {
		console.log(doc);
	}).catch(console.error);
});


process.on("SIGINT", function () {
	mongoose.connection.close(function () {
		console.log("Mongoose default connection is disconnected due to application termination");
		process.exit(0);
	});
});