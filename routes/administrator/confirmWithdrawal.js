//Set up
let express = require("express");
let router = express.Router();
const nodemailer = require("nodemailer");
let userModel = require("../../schemas/userSchema");
const ms = require("../../helpers/mailSender");

router.post("/confirmWithdrawal/:id", function(req, res){

    console.log("Confirming Withdrawal ...");

  userModel.find({"bio.login.username": req.body.user})
    .then(data => {
      const userEmail = data[0].bio.email;
      const withdrawals = data[0].withdrawals;
      const matchedWithdrawal = withdrawals.find(w => w._id == req.params.id);
      const amount = matchedWithdrawal ? parseInt(matchedWithdrawal.WithdrawalAmount) : 0;

      userModel.where({"bio.login.username": req.body.user})
        .updateOne(
            {"withdrawals._id": req.params.id},
            {$set: {"withdrawals.$.WithdrawalStatus": "Processed"}}, function(err, count){
          if(err) {
            console.log(err);
            res.status(400).send("Unable to process your payment, please contact your admin")
          } else {
            const from = `"Revolut Trading" <no-reply@therevt.com>`;
            const userSubject = "Withdrawal Confirmed";
            const userMessage = ms.withdrawalConfirmedMessage(amount);
            ms.mailSender(from, userEmail, userSubject, userMessage, "token", "token", res);
            res.status(200).send(`Withdrawal of Transaction ID <${req.params.id}> has been confirmed successfully and will be removed from this list`);
          }
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send("There's an issue with the server.")
    });
});


module.exports = router;
