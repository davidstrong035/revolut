//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../../schemas/userSchema");
const ms = require("../../helpers/mailSender");

router.post("/confirmDeposit/:id", function(req, res){

    console.log("Confirming Deposit ...");

  //First fetch the user's data to get their email and deposit amount
  userModel.find({"bio.login.username": req.body.user})
    .then(data => {
      const userEmail = data[0].bio.email;
      const deposits = data[0].deposits;
      // Find the matching deposit to get its amount
      const matchedDeposit = deposits.find(d => d._id == req.params.id);
      const amount = matchedDeposit ? parseInt(matchedDeposit.DepositAmount) : 0;

      //Update the deposit status to Processed
      userModel.where({"bio.login.username": req.body.user})
        .updateOne(
            {"deposits._id": req.params.id},
            {$set: {"deposits.$.DepositStatus": "Processed"}}, function(err, count){
          if(err) {
            console.log(err);
            res.status(400).send("Unable to process your payment, please contact your admin")
          } else {
            // Send confirmation email to user
            const from = `"Revolut Trading" <no-reply@therevt.com>`;
            const userSubject = "Deposit Confirmed";
            const userMessage = ms.depositConfirmedMessage(amount);
            ms.mailSender(from, userEmail, userSubject, userMessage, "token", "token", res);

              res.status(200).send(`Deposit of Transaction ID <${req.params.id}> has been confirmed successfully and will be removed from this list`);
          }
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("There's an issue with the server.")
    });
});


module.exports = router;
