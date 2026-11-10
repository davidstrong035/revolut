//Set up
let express = require("express");
let router = express.Router();
const ms = require("../helpers/mailSender");

router.post("/paymentProof", function (req, res) {
  console.log("Uploading payment");
  //console.log(req.body);

  const from = `"Payment Reciept" <no-reply@therevt.com>`;
  const receiver = `support@therevt.com`;
  const subject = `New Payment from ${req.user.username}`;
  const error = `Something went wrong uploading your receipt, please try again later or contact the admin ASAP.`;
  const success = `You have successfully uploaded your receipt, It will be processed and credited to your account ASAP.`;
  const message = `
        <div style="padding: 20px; width: 600px">
            <img src="/images/logo.png" style="height: 50px" />
            <h3>
                New Payment Receipt from daniel-strong
            </h3>

            <p>
                <span style="font-weight: bold">
                ${req.user.username}
                </span> claims to have made a payment of
                <span style="font-weight: bold">
                ${parseInt(req.body.trAmount).toLocaleString()}
                </span> for transaction ID
                <span style="font-weight: bold">
                {${req.body.transID}}
                </span>.
            </p>

            <p>
                Find the confirmation attachment below and take appropriate
                actions immediately to validate the user's payment.
            </p>
            <p></p>
            <p style="font-weight: bold"> PAYMENT RECEIPT </p>
            <p>
                <img src=${req.body.receipt} />
            </p>
            <p></p><p></p>

            =========================================
            <div>
                <h4> User Comment </h4>
                <p>${req.body.comment}</p>
            </div>
            =========================================

            <p style="color: gray; font-size: .8em">
				For more information on our products and services,
				please see our support article providing more detail or send us an
				email or put a call through available channels
			</p>
			<p> Sincerely, </p>

			<p style="font-weight: bolder"> Revolut </p>
            <p> http://www.therevt.com </p>
		</div>
    `;

  ms.mailSender(from, receiver, subject, message, error, success, res).then(
    (data) => res.status(200).send(success),
    (err) => res.status(400).send(error)
  );
});

module.exports = router;
