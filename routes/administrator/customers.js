//Set up
let express = require("express");
let router = express.Router();
let userModel = require("../../schemas/userSchema");

router.get("/customers", function(req, res){ 
	console.log("Fetching Customers");
	
	//let check = req.params();
	userModel.find()
		.then(data=> {
			//console.log(data)
			res.status(200).send(data);
		})
		.catch(err=> res.status(400).send("There's an issue with the server."))
});


module.exports = router;