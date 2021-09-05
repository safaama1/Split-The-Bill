const billModel = require('../models/Bill');
const UsersService = require('./users');
class BillsService {
	constructor() {}
	// add a new Bill
	async addBill(userName, rawText, Totalquantity, Totalamount, ItemArray) {
		let BillNum= await billModel.countDocuments();
		var bill= await billModel.create({rawText, Totalquantity, Totalamount, BillNum , items:JSON_TO_ItemSchema(ItemArray)});
		UsersService.addBill(userName,bill);
		return  bill;
	}

	// find and return a bill by id
	async findById(id) {
		return billModel.findById(id);
	}
	async findByBillNum(billNum) {
		return billModel.findOne(
			{BillNum: billNum}
		);
	}

	async deleteByBillNum(billNum)
	{
		await billModel.findOneAndDelete(
			{ BillNum: billNum }
		);
		for await (const bill of billModel.find()) {
			if(bill.BillNum.valueOf()>billNum)
				bill.BillNum--;
			await bill.save();
		}
	}
	
	async deleteByBillId(billId)
	{
		await this.deleteByBillNum(billModel.findOneAndDelete({ _id: billId }).BillNum);

	}
}

function JSON_TO_ItemSchema(ItemArray)
{
	var ItemSchemaArray=[];
	let count = Object.keys(JSON.parse(ItemArray)).length;
	for (let index = 0; index < count; index++) {
		var element=JSON.parse(ItemArray)[index];
		ItemSchemaArray.push({
			name:element[0],
			quantity:parseFloat( element[1].replace(/,/g, ''), 10),
			price:parseFloat( element[2].replace(/,/g, ''), 10),
			amount:parseFloat( element[3].replace(/,/g, ''), 10)
		});		
	}
	return ItemSchemaArray;
}
module.exports = new BillsService();