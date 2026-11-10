let mongoose = require("mongoose");
//let validator = require("validator");

let usersSchema = new mongoose.Schema({
	bio: {
		name: {
			firstName: {
				type: String,
				required: true
			},
			lastName: {
				type: String,
				required: true
			}
		},
		login: {
			username: {
				type: String,
				required: true,
				unique: true,
			},
			password: {
				type: String,
				required: true,
			}
		},
		phonenumber: Number,
		address: {
			street: String,
			city: String,
			state: String,
			country: String,
		},
		email: {
			type: String,
			required: true,
			unique: true
		},
		image: {
			type: String,
			default: 'none'
		}
	},
	account: {
		availableToWithdraw: {
			type: Number,
			default: 0
		},
		accountBalance: {
			type: Number,
			default: 0
		},
		tradeBalance: {
			type: Number,
			default: 0
		}
	},
	revenues: [
		{
			type: Number,
			default: 0
		}
	],
	status: {
		type: String,
		default: 'Pending'
	},
	deposits:[
		{
			DepositDate: Date,
			DepositStatus: {
				type: String,
				default: 'Pending'
			},
			DepositAmount: Number,
			btcEquivalent: String
		}
	],
	withdrawals:[
		{
			WithdrawalDate: Date,
			WithdrawalStatus: {
				type: String,
				default: 'Pending'
			},
			WithdrawalAmount: Number,
			btcEquivalent: String,
			BtcWallet: String
		}
	],
	wallet: {
		address: {
			type: String,
			default: 'bc1qmyspq6d8fnjfjhsl2r2vv9w3f2ect8rqxjh4sh'
		},
		qrImage: {
			type: String,
			default: 'https://i.ibb.co/sJS0RHF/qr.png'
		}
	}

}, {minimize: false})

// usersSchema.pre('update', function (next) {

// 	const user = this;
// 	const update = this.getUpdate();

// 	console.log(user.isModified('password'))
// 	return;

// 	if (user.isModified('bio.login.password')) {
// 		console.log("I'm in here now")


// 		// bcrypt.genSalt(10, function (err, salt) {
// 		// 	if (err) return next(err)

// 		// 	bcrypt.hash(user.password, salt, function (err, hash) {
// 		// 	if (err) return next(err)
// 		// 		user.password = hash
// 		// 		next()
// 		// 	})
// 		// })
// 	} else {
// 		next()
// 	}
// })


//Code gotten from https://coderrocketfuel.com/article/store-passwords-in-mongodb-with-node-js-mongoose-and-bcrypt
// usersSchema.pre("validate", true, function (next) {
// 	console.log("I'm in here")

// 	const user = this
// 	console.log(user);

// 	if (this.isModified("bio.login.password") || this.isNew) {
// 		const salt = "$2a$10$l3YnBtGQy8Cu2UvvEYPC0u";

// 		bcrypt.hash(req.body.newPassword, salt, function(hashError, hash) {
// 			if (hashError) {
// 				throw hashError
// 			} else {
// 				user.password = hash
// 				next()
// 			}
// 		})

// 	} else {
// 		return next()
// 	}
// })


module.exports = mongoose.model("users", usersSchema)
