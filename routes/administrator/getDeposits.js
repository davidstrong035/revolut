//Set up
let express = require("express");
let router = express.Router();
let userModel = require("../../schemas/userSchema");

router.get("/getDeposits/:user", function(req, res){ 
	console.log("Fetching Depoists");

	//console.log(req.user);

	//let check = req.params();
	userModel.find({"bio.login.username": req.params.user})
		.then(data=> {
			//console.log(data[0].deposits)
			res.status(200).send(data[0].deposits);
		})
		.catch(err=> res.status(400).send("There's an issue with the server."))
});


module.exports = router;