//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../../schemas/userSchema");

router.post("/confirmAccount/:id", function(req, res){

    console.log("verifying new account ...");
	
	//Update the password field
	userModel.where({"_id": req.params.id})
		.updateOne({$set: {"status": "Active"}}, function(err, count){
			if(err) {
				console.log(err);
				res.status(400).send("Unable to verify this account, please try again.")
			} else {
	        	res.status(200).send(" account is now active and ready to invest. :)"); 
			}
		});
});


module.exports = router;