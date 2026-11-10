const nodemailer = require("nodemailer");

module.exports.mailSender = (
  from,
  receiver,
  subject,
  message,
  error,
  success,
  res,
  user = "no-reply@therevt.com"
) => {
  return new Promise((resolve, reject) => {
    // SMTP transporter
    let transporter = nodemailer.createTransport({
      host: "mail.therevt.com",
      secureConnection: true,
      port: 465,
      auth: {
        user: user, // Generated eheereal User
        pass: "26;FpU8*fP3sqX", // Generated etheral pass
      },
    });

    let mailOptions = {
      from: from,
      to: receiver,
      subject: subject,
      html: message,
    };

    // Send mail with defined transport object
    transporter.sendMail(mailOptions, (err, info) => {
      console.log("Executing Mail Sending ...");
      if (err) {
        console.log(err);
        if (error === "token") {
          reject(true);
        } else {
          reject(error);
          // return res.status(400).send(error);
        }
      }
      if (success === "token") {
        resolve(true);
      } else {
        resolve(success);
        // res.status(200).send(success);
      }
      console.log("(Confirmation) Message Sent");
      //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    });
  });
};

module.exports.accountMessage = (amount) => {
  return `
		<div style="padding: 20px; width: 600px">
			<img src="/images/logo.png" style="height: 50px" />
			<p></p>

			<p>
				A total profit of $${amount.toLocaleString()} has been  added
				to your account from the live trading and
				trading now completed. Visit our website
				to see your account details
			</p>

			<p></p><p></p>

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
};

module.exports.tradingMessage = (amount) => {
  return `
		<div style="padding: 20px; width: 600px">
			<img src="/images/logo.png" style="height: 50px" />
			<p></p>

			<p>
				Your investment deposit of $${amount.toLocaleString()} has been received and
                added to your online trading account. Visit our
                website to see your live trading
			</p>

			<p></p><p></p>

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
};
module.exports.availableMessage = (amount) => {
  return `
		<div style="padding: 20px; width: 600px">
			<img src="/images/logo.png" style="height: 50px" />
			<p></p>

			<p>
				You now have an extra $${amount.toLocaleString()} aded to your
                Available to withdawa account. Feel Free to request for the withdrawal
                whenever you please. :)
			</p>

			<p></p><p></p>

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
};

module.exports.withdrawalMessage = async (amount) => {
  return `
		<div style="padding: 20px; width: 600px">
			<img src="/images/logo.png" style="height: 50px" />
			<p></p>

			<p>
				Your withdrawal of $${amount.toLocaleString()} has been received
                and processed. Please contact our
                customer support for commission fee and
                Verification
			</p>

			<p></p><p></p>

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
};

module.exports.depositRequestMessage = (username, amount) => {
  return `
    <div style="padding: 20px; width: 600px">
      <h3> New Deposit Request </h3>
      <p>User <strong>${username}</strong> has requested a deposit of <strong>$${amount.toLocaleString()}</strong>.</p>
      <p>Please log in to the admin dashboard to review and process this request.</p>
      <p></p><p></p>
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
};

module.exports.depositRequestUserMessage = (amount) => {
  return `
    <div style="padding: 20px; width: 600px">
      <img src="/images/logo.png" style="height: 50px" />
      <p></p>
      <p>
        Your deposit request of <strong>$${amount.toLocaleString()}</strong> has been received successfully.
        It will be processed and credited to your account shortly.
      </p>
      <p>If you have any questions, please contact our support team.</p>
      <p></p><p></p>
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
};

module.exports.withdrawalRequestMessage = (username, amount) => {
  return `
    <div style="padding: 20px; width: 600px">
      <h3> New Withdrawal Request </h3>
      <p>User <strong>${username}</strong> has requested a withdrawal of <strong>$${amount.toLocaleString()}</strong>.</p>
      <p>Please log in to the admin dashboard to review and process this request.</p>
      <p></p><p></p>
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
};

module.exports.withdrawalRequestUserMessage = (amount) => {
  return `
    <div style="padding: 20px; width: 600px">
      <img src="/images/logo.png" style="height: 50px" />
      <p></p>
      <p>
        Your withdrawal request of <strong>$${amount.toLocaleString()}</strong> has been received successfully.
        It will be processed shortly.
      </p>
      <p>If you have any questions, please contact our support team.</p>
      <p></p><p></p>
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
};

module.exports.depositConfirmedMessage = (amount) => {
  return `
    <div style="padding: 20px; width: 600px">
      <img src="/images/logo.png" style="height: 50px" />
      <p></p>
      <p>
        Your deposit of <strong>$${amount.toLocaleString()}</strong> has been confirmed and processed successfully.
      </p>
      <p>You can view your updated account balance by logging into your dashboard.</p>
      <p></p><p></p>
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
};

module.exports.withdrawalConfirmedMessage = (amount) => {
  return `
    <div style="padding: 20px; width: 600px">
      <img src="/images/logo.png" style="height: 50px" />
      <p></p>
      <p>
        Your withdrawal of <strong>$${amount.toLocaleString()}</strong> has been confirmed and processed successfully.
      </p>
      <p>You can view your updated account balance by logging into your dashboard.</p>
      <p></p><p></p>
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
};
