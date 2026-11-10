//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let adminModel = require("../../schemas/adminSchema");

router.post("/setWalletData", function(req, res){

    console.log("Setting wallet data ...");

	//Update the password field
	adminModel.where({"bio.login.username": req.admin.adminID})
		.updateOne({$set: {
			"wallet.address": req.body.walletAddress,
			"wallet.qrImage": req.body.qrImage
		}}, function(err, count){
			if(err) {
				console.log(err);
				res.status(400).send("Unable to set your wallet address, please try again.")
			} else {
	        	res.status(200).send("Wallet address has been set successfully. :)"); 
			}
		});
});


module.exports = router;