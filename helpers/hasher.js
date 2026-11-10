//code gotten from https://coderrocketfuel.com/article/store-wordToHashs-in-mongodb-with-node-js-mongoose-and-bcrypt
const bcrypt = require("bcryptjs")

module.exports.hash = (req, res, next) => {

    //Check if you're updating password or registering a new user
    if(req.body.reason === "updatePassword") {
        //If you're updating a password and the current password
        //is incorrect, return early
        if(req.body.pwd === req.user.pwd) {
            return res.status(400).send("Your current password is wrong. Please use the right one")
        }
    } 
    
    const salt = "$2a$10$l3YnBtGQy8Cu2UvvEYPC0u";
    
    bcrypt.hash(req.body.wordToHash.trim(), salt, function(hashError, hash) {
        if (hashError) {
            throw hashError
        } else {
            req.body.wordToHash = hash;
            next();
            //console.log(typeof(hash));
        }
    })
}


module.exports.unhash = (word, hash) => {
    return new Promise((resolve, reject) => {  
        bcrypt.compare(word, hash, function(error, isMatch) {
            console.log("Trying to unhash pasword ...");
            if (error) {
                throw error
            } else if (!isMatch) {
                //console.log("Password doesn't match!");
                reject("Password doesn't match!")
            } else {
                console.log("Password matches!");
                resolve(true)
            }
        })
    })
}