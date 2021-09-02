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
	BillNum: {
		type: Number,
		required: true
	},
	items: [itemSchema]
});
module.exports = mongoose.model('Bill',Bill);