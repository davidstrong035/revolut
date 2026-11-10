//Set up
let express = require("express");
let router = express.Router();
let userModel = require("../../schemas/userSchema");

router.get("/adminWithdrawalReqs", function(req, res){
	//let check = req.params();
	userModel.find({"withdrawals.WithdrawalStatus": "Pending"})
		.then(data=> {
			//console.log(data)
			res.status(200).send(data);
		})
		.catch(err => {
			console.log(err)
		})
});


module.exports = router;