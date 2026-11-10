//Set up
let express = require("express");
let router = express.Router();
let adminModel = require("../../schemas/adminSchema");

router.get("/adminProfile", function(req, res){ 
	console.log("Fetching adminProfile");
	console.log(req.admin);
	//let check = req.params();
	adminModel.find({"bio.login.username": req.admin.username})
		.then(data=> {
			//console.log(data)
			res.status(200).send(data[0]);
		})
		.catch(err=> res.status(400).send("There's an issue with the server."))
});


 router.delete('/adminProfile', function(req,res){
		adminModel.deleteOne({"bio.login.username": req.admin.username}, function (err, user) {
			if (err) return res.status(400).send("Error trying to delete your account, please contact the admin.");
			res.status(200).send("User successfully removed from polls collection!");
		});
  });

module.exports = router;