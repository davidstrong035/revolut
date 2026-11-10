//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../../schemas/userSchema");

router.delete("/removeAccount/:id", function(req, res){

    console.log("Removing account ...");
	
	//Remove user
	userModel.findByIdAndRemove(req.params.id,  (err, result) => {
		if(err) {
			console.log(err);
			res.status(400).send("Unable to remove this account at the moment please try again.")
		} else {
			res.status(200).send("Account successfully deleted from the database :)"); 
		}
	})
});


module.exports = router;