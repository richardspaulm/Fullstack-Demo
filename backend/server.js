const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

const API_PORT = 3001;
const app = express();
const router = express.Router();

const dbRoute = "mongodb://paul:password1@ds253783.mlab.com:53783/richardspaulmtest";

mongoose.connect(
	dbRoute,
	{ useNewUrlParser: true}
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error", console.error.bind(console, "Mongo connection error"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger("dev"));

//Get Method
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

//Post Update Method
router.post("/updateData", (req, res) => {
	const { id, update } = req.body;
	Data.findOneAndUpdate(id, update, err => {
		if (err) return res.json({success: false, error: err});
		return res.json({success: true});
	});
});


//Delete
router.delete("/deleteData", (req, res) => {
	const { message } = req.body;
	Data.deleteMany({"message": message}, err => {
		if(err) return res.send(err);
		return res.json({success: true});
	});
});

//create
router.post("/putData", (req, res) => {
	let data = new Data();
	const { id, message } = req.body;

	if((!id && id !== 0) || !message) {
		return res.json({
			success: false,
			error: "Invalid Inputs"
		});
	}

	data.message = message;
	data.id = id;
	data.save(err => {
		if(err) return res.json({success: false, error: err});
		return res.json({success: true});
	});
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));