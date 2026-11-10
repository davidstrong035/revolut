//Set up
let express = require("express");
let router = express.Router();
const ms = require("../helpers/mailSender");
let userModel = require("../schemas/userSchema");
const hash = require("../helpers/hasher");

router.post("/updatePassword", hash.hash, function (req, res) {
  console.log("Updating password");

  let d = new Date();
  let today = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}`;

  const from = `"Revolut Trading" <no-reply@therevt.com>`;
  const subject = `Your Password has just been changed`;
  const error = `We couldn't send an email to you. But your password has been changed successfully.`;
  const success = `Password updated successfully, You'll be logged out now so you can log in with your new password`;
  const message = `
		<div style="padding: 20px; width: 600px">
			<img src="/images/logo.png" style="height: 50px" />
			<p></p>
			<h3>
				*SECURITY* Password Update!
			</h3>

			<p>
				The password to this account has been changed on ${today},
			</p>

			<p>
				If you didn't make this change on your account, kindly contact us so appropriate
				actions can be taken to protect your account from unauthorized activities.
			</p>

			<p style="color: gray; font-size: .8em">
				For more information on our products and services,
				please see our support article providing more detail or send us an
				email or put a call through available channels
			</p>
			<p> Sincerely, </p>

			<p style="font-weight: bolder"> Revolut Trading </p>
			<p> www.therevt.com </p>
		</div>
	`;

  //Update the password field
  userModel
    .where({ "bio.login.username": req.user.username })
    .updateOne(
      { $set: { "bio.login.password": req.body.wordToHash } },
      function (err, count) {
        if (err) {
          console.log(err);
          res
            .status(400)
            .send("Unable to update your password, please try again later");
        } else {
          userModel.find(
            { "bio.login.username": req.user.username },
            function (err, user) {
              if (err)
                return res
                  .status(500)
                  .send("Something went wrong please try again");
              let receiver = user[0].bio.email;
              ms.mailSender(
                from,
                receiver,
                subject,
                message,
                error,
                success,
                res
              ).then(
                (data) => res.status(200).send(success),
                (err) => res.status(400).send(error)
              );
            }
          );

          //res.status(200).send("Password updated successfully, You'll be logged out now so you can log in with your new password");
        }
      }
    );
});

module.exports = router;
