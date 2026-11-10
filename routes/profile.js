//Set up
let express = require("express");
let router = express.Router();
let userModel = require("../schemas/userSchema");
const ms = require("../helpers/mailSender");

router.get("/profile", function (req, res) {
  console.log("Fetching profile");
  //console.log(req.user);
  //let check = req.params();
  userModel
    .find({ "bio.login.username": req.user.username })
    .then((data) => {
      //console.log(data)
      res.status(200).send(data[0]);
    })
    .catch((err) => res.status(400).send("There's an issue with the server."));
});

router.delete("/removeAccount", function (req, res) {
  console.log("Deleting an account ...");
  var receiver = "";

  const from = `"RVT" <no-reply@absolute-invt.com>`;
  const subject = `We will miss you :(`;
  const error = `We were unable to remove your account.`;
  const success = `Your data has been successfully deleted from our database. If you have any outstanding, kindly reach out to our admin.`;
  const message = `
		<div style="padding: 20px; width: 600px">
			<img src="/images/logo.png" style="height: 50px" />
			<p></p>
			<h3>
				*SECURITY* ACCOUNT DELETED!
			</h3>

			<p>
				We hate to see you go, but since you have requested this,
				we have no option than to grant your request.
			</p>
			
			<p>
				Your account has been completely removed from our database. If you wish
				to reinvest with us, we will be glad to have you. We hope to see you soon again.
			</p>

			<p style="color: gray; font-size: .8em">
				For more information on our products and services,
				please see our support article providing more detail or send us an
				email or put a call through available channels
			</p>
			<p> Sincerely, </p>

			<p style="font-weight: bolder"> Absolute Invstment </p>
			<p> www.absolute-invt.com </p>
		</div>
	`;

  userModel.find(
    { "bio.login.username": req.user.username },
    function (err, user) {
      if (err)
        return res.status(500).send("Something went wrong please try again");
      receiver = user[0].bio.email;
      userModel.deleteOne(
        { "bio.login.username": req.user.username },
        function (err, user) {
          if (err)
            return res
              .status(400)
              .send(
                "Error trying to delete your account, please contact the admin."
              );

          ms.mailSender(from, receiver, subject, message, error, success, res);
          //res.status(200).send("Your data has been successfully deleted from our database. If you have any outstanding, kindly reach out to our admin.");
        }
      );
    }
  );
});

module.exports = router;
