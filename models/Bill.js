const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema({ name: String, quantity:{type:Number,min:0}, price: Number, amount: Number });
const Bill = mongoose.Schema( {
	rawText: {
		type: String,
		required: true
	},
	Totalquantity:{
		type: Number,
		min: 0,
		required: true
	},
	Totalamount:{
		type: Number,
		//min: 0,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	items: [itemSchema]
});
module.exports = Bill;
// const Bill = mongoose.model('Bill', {
// 	rawText: {
// 		type: String,
// 		required: true
// 	},
// 	Totalquantity:{
// 		type: Number,
// 		min: 0,
// 		required: true
// 	},
// 	Totalamount:{
// 		type: Number,
// 		//min: 0,
// 		required: true
// 	},
// 	created: {
// 		type: Date,
// 		default: Date.now
// 	},
// 	items: [itemSchema]
// });