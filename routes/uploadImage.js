//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../schemas/userSchema");
const hash = require("../helpers/hasher");

const comparePasswords = () => {

}


router.post("/uploadImage", function(req, res){

    console.log("Uploading Image");
	
	//Update the password field
	userModel.where({"bio.login.username": req.user.username})
		.updateOne({$set: {"bio.image": req.body.imageString}}, function(err, count){
			if(err) {
				console.log(err);
				res.status(400).send("Unable to save your image, please try again")
			} else {
	        	res.status(200).send("Image has been uploaded successfully."); 
			}
		});
});


module.exports = router;