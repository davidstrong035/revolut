//Set up
const express = require("express");
const router = express.Router();
const userModel = require("../schemas/userSchema");
const ms = require("../helpers/mailSender");
//const { nanoid } = require("nanoid");

router.post("/deposit", function(req, res){
	console.log("Depositing cash ...");
	
	let newDepositHistory = {
		DepositDate: new Date().toISOString().slice(0,10),
		//DepositStatus: has a default value in shcema,
		DepositAmount: req.body.amount,
		btcEquivalent: req.body.btcEquiv
	};

	userModel.find({"bio.login.username": req.user.username})
		.then(data=> {
			const userEmail = data[0].bio.email;
			const amount = parseInt(req.body.amount);

			userModel.where({"bio.login.username": req.user.username})
				.updateOne({$push: {deposits: newDepositHistory} }, function(err, count){
					if(err){
						console.log(err);
						console.log("Couldn't Update Your Deposit History");
					} else{
						// Send confirmation email to user
						const from = `"Revolut Trading" <no-reply@therevt.com>`;
						const userSubject = "Deposit Request Received";
						const userMessage = ms.depositRequestUserMessage(amount);
						ms.mailSender(from, userEmail, userSubject, userMessage, "token", "token", res);

						// Send notification to admin
						const adminSubject = `New Deposit Request from ${req.user.username}`;
						const adminMessage = ms.depositRequestMessage(req.user.username, amount);
						ms.mailSender(from, "support@therevt.com", adminSubject, adminMessage, "token", "token", res);

						res.status(200).send("Your Deposit Request was successful")
						console.log("Updated deposit history list")
					}
				  }
				);

		})
		.catch(err=> res.status(500).send("There's an issue with the server."))
});

router.get("/deposit", function(req, res){
	console.log("Fetching Deposit History ...");

	userModel.find({"bio.login.username": req.user.username}, function(err, user){
		if(err){
			console.log("An error occured while fetching deposit history");
			//console.log(err);
			res.status(500).send("There was an error fetching your deposit history.")
		} else {
			let depositHistoryArr = user[0].deposits;
			res.status(200).send(depositHistoryArr);
		}
	})
})

module.exports = router;