let mongoose = require("mongoose");
//let validator = require("validator");

let adminSchema = new mongoose.Schema({
	bio: {
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
		email: {
			type: String,
			required: true,
			unique: true
		},
	},
	status: {
		privillege: String
	},
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

module.exports = mongoose.model("admins", adminSchema)