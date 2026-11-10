//Set up
let express = require("express");
let router = express.Router();
let userModel = require("../../schemas/userSchema");

router.get("/adminDepositReqs", function(req, res){
	//let check = req.params();
	userModel.find({"deposits.DepositStatus": "Pending"})
		.then(data=> {
			//console.log(data)
			res.status(200).send(data);
		})
		.catch(err=> res.status(400).send("There's an issue with the server."))
});


module.exports = router;