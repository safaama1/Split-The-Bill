const mongoose = require('mongoose');
const billModel = require('./Bill');
const User = mongoose.model('User', {
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	bills: [billModel.schema]
});

module.exports = User;
