//Set up
let express = require("express");
let router = express.Router();
let adminModel = require("../../schemas/adminSchema");
let userModel = require("../../schemas/userSchema");
const ms = require("../../helpers/mailSender");

//This function is used to grab the current amounts in the user's database
const getFieldsValue = (user) => {
  return new Promise((resolve, reject) => {
    userModel.find({ "bio.login.username": user }, function (err, customer) {
      if (err) {
        reject("Couldn't find user in your database");
      } else {
        resolve([customer[0].account, customer[0].bio.email, customer[0].deposits, customer[0].withdrawals]);
      }
    });
  });
};

//This function actually runs the update to the db
const executeUpdate = async (user, updateObj, req, res) => {
  console.log({ user });
  console.log("Executing transaction now ...");
  console.log({ updateObj });
  await userModel
    .where({ "bio.login.username": user })
    .updateOne({ $set: updateObj });
};

//This is the route
router.post("/transact", async (req, res) => {
  console.log("Transacting ...");

  // This sets the message sending variables //
  const from = `"Revolut Trading" <no-reply@therevt.com>`;
  var receiver = "";
  const subject = `A Transaction Just occured on your account.`;
  const error = `token`;
  const success = `token';`;
  var message = "";
  // This sets the message sending variables //

  //Grab the various peice of data from the req object
  let { user, transactionType, purpose, accountField, amount } = req.body;
  const parsedAmt = parseInt(amount); //becaue the value is stored as number in database

  getFieldsValue(user)
    .then(async (data) => {
      //console.log(data);

      // Set The email variable after grabbing it from the db
      receiver = data[1];
      if (req.body.transactionType === "credit") {
        console.log("About to credit ...");

        // --- Match or create deposit entry ---
        var deposits = data[2] || [];
        // Find pending deposits with the matching amount, sorted most recent first
        var matchingDeposits = deposits
          .filter(function (d) { return d.DepositStatus === "Pending" && d.DepositAmount === parsedAmt; })
          .sort(function (a, b) { return new Date(b.DepositDate) - new Date(a.DepositDate); });

        if (matchingDeposits.length > 0) {
          // Update the most recent matching deposit to "Processed"
          await userModel
            .where({ "bio.login.username": user })
            .updateOne(
              { "deposits._id": matchingDeposits[0]._id },
              { $set: { "deposits.$.DepositStatus": "Processed" } }
            );
          console.log("Matched and updated existing deposit to Processed");
        } else {
          // Push a new deposit entry with Processed status
          await userModel
            .where({ "bio.login.username": user })
            .updateOne({
              $push: {
                deposits: {
                  DepositDate: new Date(),
                  DepositAmount: parsedAmt,
                  DepositStatus: "Processed",
                  btcEquivalent: ""
                }
              }
            });
          console.log("No matching deposit found — created new deposit entry");
        }
        // --- End deposit handling ---

        var update = {};

        if (accountField === "account") {
          let newAmount = parseInt(data[0].accountBalance) + parsedAmt;
          update = { "account.accountBalance": newAmount };
          message = ms.accountMessage(parsedAmt);
        } else if (accountField === "withdrawal") {
          let newAmount = parseInt(data[0].availableToWithdraw) + parsedAmt;
          update = { "account.availableToWithdraw": newAmount };
          message = ms.availableMessage(parsedAmt);
        } else {
          let newAmount = parseInt(data[0].tradeBalance) + parsedAmt;
          update = { "account.tradeBalance": newAmount };
          message = ms.tradingMessage(parsedAmt);
        }

        await executeUpdate(user, update, req, res);

        await ms
          .mailSender(
            from,
            receiver,
            subject,
            message,
            error,
            success,
            res,
            "info@therevt.com"
          )
          .then((data) =>
            res.status(200).send(`Your transaction was successful.`)
          );
      } else {
        console.log("Debiting ...");

        // --- Match or create withdrawal entry ---
        var withdrawals = data[3] || [];
        // Find pending withdrawals with the matching amount, sorted most recent first
        var matchingWithdrawals = withdrawals
          .filter(function (w) { return w.WithdrawalStatus === "Pending" && w.WithdrawalAmount === parsedAmt; })
          .sort(function (a, b) { return new Date(b.WithdrawalDate) - new Date(a.WithdrawalDate); });

        if (matchingWithdrawals.length > 0) {
          // Update the most recent matching withdrawal to "Processed"
          await userModel
            .where({ "bio.login.username": user })
            .updateOne(
              { "withdrawals._id": matchingWithdrawals[0]._id },
              { $set: { "withdrawals.$.WithdrawalStatus": "Processed" } }
            );
          console.log("Matched and updated existing withdrawal to Processed");
        } else {
          // Push a new withdrawal entry with Processed status
          await userModel
            .where({ "bio.login.username": user })
            .updateOne({
              $push: {
                withdrawals: {
                  WithdrawalDate: new Date(),
                  WithdrawalAmount: parsedAmt,
                  WithdrawalStatus: "Processed",
                  btcEquivalent: "",
                  BtcWallet: ""
                }
              }
            });
          console.log("No matching withdrawal found — created new withdrawal entry");
        }
        // --- End withdrawal handling ---

        message = await ms.withdrawalMessage(parsedAmt);

        var update = {};

        console.log({ accountField });

        if (accountField === "account") {
          let newAmount = parseInt(data[0].accountBalance) - parsedAmt;
          console.log({ newAmount });
          update = { "account.accountBalance": newAmount };
          if (newAmount < 0) {
            return res
              .status(500)
              .send("Insufficient Balance to execute that debit transaction");
          }
        } else if (accountField === "withdrawal") {
          let newAmount = parseInt(data[0].availableToWithdraw) - parsedAmt;
          update = { "account.availableToWithdraw": newAmount };
          if (newAmount < 0) {
            return res
              .status(500)
              .send("Insufficient Balance to execute that debit transaction");
          }
        } else {
          let newAmount = parseInt(data[0].tradeBalance) - parsedAmt;
          update = { "account.tradeBalance": newAmount };
          if (newAmount < 0) {
            return res
              .status(500)
              .send("Insufficient Balance to execute that debit transaction");
          }
        }

        await executeUpdate(user, update, req, res);

        console.log(from, receiver, subject);

        await ms
          .mailSender(
            from,
            receiver,
            subject,
            message,
            error,
            success,
            res,
            (user = "no-reply@therevt.com")
          )
          .then((data) =>
            res.status(200).send(`Your transaction was successful.`)
          );
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send("Something went wrong while executing this transaction.");
    });
});

module.exports = router;
