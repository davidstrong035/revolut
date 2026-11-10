//Set up
let express = require("express");
let router = express.Router();
let adminModel = require("../schemas/adminSchema");

router.get("/getWalletData", function(req, res){ 
	console.log("Fetching Wallet Data");

	adminModel.find({"bio.login.username": "revolut-admin"})
		.then(data=> {
			res.status(200).send(data[0].wallet);
		})
		.catch(err=> res.status(400).send("There's an issue with the server."))
});

module.exports = router;