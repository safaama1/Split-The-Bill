const billModel = require('../models/Bill');
const UsersService = require('./users');

class BillsService {
	constructor() {}
	// add a new Bill
	async addBill(userName, rawText, Totalquantity, Totalamount, ItemArray) {
		var bill= await billModel.create({rawText, Totalquantity, Totalamount, ItemArray});
		UsersService.addBill(userName,bill);
		return  bill;
	}

	// find and return a bill by id
	async findById(id) {
		return billModel.findById(id);
	}
}
module.exports = new BillsService();