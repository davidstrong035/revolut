const jwt = require("jsonwebtoken");

const config = process.env;


const USER_PATH = [
    "/deposit", "/profile", "/updatePassword", "/withdrawals", "/getWalletData",
    "/uploadImage", "/updateEmail", "/removeAccount", "/withdrawal", "/paymentProof"
]

const verifyToken = (req, res, next) => {
    const tokenString = req.headers.authorization;

    if(req.path == "/login" || req.path == "/adminLogin" || req.path == "/register") {
        next();
    } else {

        if(!tokenString){
            console.log("Unauthorized...")
            return res.status(403).send("You don't appear to be authenticated. Please do the right thing :)")
        }

        try {
            console.log("Authorized..");
            let token = tokenString.replace('Bearer ', '');

            if(USER_PATH.includes(req.path)) {
                console.log("User path")
                const decoded = jwt.verify(token, config.TOKEN_KEY);
                req.user = decoded;
            } else {
                console.log("Admin path")
                const decoded = jwt.verify(token, config.ADMIN_TOKEN_KEY);
                req.admin = decoded;
            }


        } catch (err) {
            console.log(err);
            return res.status(401).send("Sorry, We can't let you in ...")
        }
        next();
    }
}

module.exports = verifyToken;