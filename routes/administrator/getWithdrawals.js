//Set up
let express = require("express");
let router = express.Router();
let userModel = require("../../schemas/userSchema");

router.get("/getWithdrawals/:user", function(req, res){ 
	console.log("Fetching Customers");

	//console.log(req.user);

	//let check = req.params();
	userModel.find({"bio.login.username": req.params.user})
		.then(data=> {
			//console.log(data[0].withdrawals)
			res.status(200).send(data[0].withdrawals);
		})
		.catch(err=> res.status(400).send("There's an issue with the server."))
});


module.exports = router;