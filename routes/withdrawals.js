//Set up
const express = require("express");
const router = express.Router();
const userModel = require("../schemas/userSchema");
const ms = require("../helpers/mailSender");
//const { nanoid } = require("nanoid");

router.post("/withdrawal", function(req, res){

	console.log(req.body);

	console.log("Withdrawing cash ...");

	let newWithdrawalHistory = {
		WithdrawalDate: new Date().toISOString().slice(0,10),
		//DepositStatus: has a default value in shcema,
		WithdrawalAmount: req.body.amount,
		btcEquivalent: req.body.btcEquiv,
		BtcWallet: req.body.btcWallet
	};

	userModel.find({"bio.login.username": req.user.username})
		.then(data=> {
			const userEmail = data[0].bio.email;
			const amount = parseInt(req.body.amount);

			userModel.where({"bio.login.username": req.user.username})
				.updateOne({$push: {withdrawals: newWithdrawalHistory} }, function(err, count){
					if(err){
						console.log(err);
						console.log("Couldn't Update Your Withdrawals History");
					} else{
						// Send confirmation email to user
						const from = `"Revolut Trading" <no-reply@therevt.com>`;
						const userSubject = "Withdrawal Request Received";
						const userMessage = ms.withdrawalRequestUserMessage(amount);
						ms.mailSender(from, userEmail, userSubject, userMessage, "token", "token", res);

						// Send notification to admin
						const adminSubject = `New Withdrawal Request from ${req.user.username}`;
						const adminMessage = ms.withdrawalRequestMessage(req.user.username, amount);
						ms.mailSender(from, "support@therevt.com", adminSubject, adminMessage, "token", "token", res);

						res.status(200).send("Your Withdrawal Request was successful")
						console.log("Updated Withdrawal history list")
					}
				  }
				);

		})
		.catch(err=> res.status(500).send("There's an issue with the server."))
});

router.get("/withdrawals", function(req, res){
	console.log("Fetching Withdrawal History ...");

	userModel.find({"bio.login.username": req.user.username}, function(err, user){
		if(err){
			console.log("An error occured while fetching withdrawal history");
			//console.log(err);
			res.status(500).send("There was an error fetching your withdrawal history.")
		} else {
			let withdrawalHistoryArr = user[0].withdrawals;
			res.status(200).send(withdrawalHistoryArr);
		}
	})
})

module.exports = router;