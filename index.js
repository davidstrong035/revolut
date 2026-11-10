require("dotenv").config();
const express = require("express");
const fs = require("fs");
// const logger = require('morgan');
const cors = require("cors");

const app = express();
require("./database");
const verifyToken = require("./middlewares/authMD");

// //lOGGGER
// if(app.get("env") == "production") {
//     let accessLogStream = fs.createWriteStream(__dirname + '/logs/' + "access.log", {flags: 'a'});
//     app.use(logger({stream: accessLogStream}));
// } else {
//     app.use(logger("dev")); //log to console on development
// }g

app.use(cors());
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(verifyToken);
//Routes path;
const login = require("./routes/login");
const deposit = require("./routes/deposit");
const profile = require("./routes/profile");
const updatePassword = require("./routes/updatePassword");
const withdrawals = require("./routes/withdrawals");
const register = require("./routes/register");
const uploadImage = require("./routes/uploadImage");
const updateEmail = require("./routes/updateEmail");
const paymentProof = require("./routes/paymentProof");
const getWalletData = require("./routes/getWalletData");

app.use("/", login);
app.use("/", deposit);
app.use("/", profile);
app.use("/", updatePassword);
app.use("/", withdrawals);
app.use("/", register);
app.use("/", uploadImage);
app.use("/", updateEmail);
app.use("/", paymentProof);
app.use("/", getWalletData);

// Admin Routes Path
const adminLogin = require("./routes/administrator/adminLogin");
const adminProfile = require("./routes/administrator/adminProfile");
const customers = require("./routes/administrator/customers");
const depositReqs = require("./routes/administrator/adminDepositReqs");
const withdrawalReqs = require("./routes/administrator/adminWithdrawalReqs");
const confirmDeposit = require("./routes/administrator/confirmDeposit");
const confirmWithdrawal = require("./routes/administrator/confirmWithdrawal");
const getDeposits = require("./routes/administrator/getDeposits");
const getWithdrawals = require("./routes/administrator/getWithdrawals");
const confirmAccount = require("./routes/administrator/confirmAccount");
const cashFlow = require("./routes/administrator/cashFlow");
const removeAccount = require("./routes/administrator/removeAccount");
const setWalletData = require("./routes/administrator/setWalletData");

app.use("/", adminLogin);
app.use("/", adminProfile);
app.use("/", customers);
app.use("/", depositReqs);
app.use("/", confirmDeposit);
app.use("/", getDeposits);
app.use("/", withdrawalReqs);
app.use("/", getWithdrawals);
app.use("/", confirmAccount);
app.use("/", confirmWithdrawal);
app.use("/", cashFlow);
app.use("/", removeAccount);
app.use("/", setWalletData);

app.listen(process.env.PORT || 3000);
console.log(`Revolut Server Started`);

module.exports = app;
