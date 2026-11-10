//Set up
let express = require("express");
let router = express.Router();
let userModel = require("../schemas/userSchema");
const hash = require("../helpers/hasher"); 
const jwt = require("jsonwebtoken");

router.post("/login", function(req, res){

	console.log("Trying to log you in");

	//Destructure username and pwd from the request body
	const { username, pwd } = req.body;
    
	userModel.find({"bio.login.username": req.body.username}, function(err, user){
		if(err){
			console.log("An error occured");
			console.log(err);
			res.send({"error": " There was an error processing your request."})
		} else {
			if(user.length > 0){
				//console.log(user[0].bio.login.password)
                //Compare pwd from user and pwd from db
                hash.unhash(pwd, user[0].bio.login.password)
                    .then( result => {
                        if((username == user[0].bio.login.username)){
                            console.log("User found");

							//Create token
							const token = jwt.sign(
								{ username, pwd },
								process.env.TOKEN_KEY,
								{
									expiresIn: "2h"
								}
							)
							//let user = token;	//Save token in the user variable
                            res.status(200).send({token});
                        }
                    })
                    .catch(err => {
						console.log(err)
						res.status(401).send("Your username and/or password isn't correct. Please try again")
					})
			} else{
				console.log("User not registered");
				res.status(401).send(`${req.body.username} isn't registered on our database`)
			}
		}
	})
});

module.exports = router;