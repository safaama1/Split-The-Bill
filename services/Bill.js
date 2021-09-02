const billModel = require('../models/Bill');
const UsersService = require('./users');
var count;
class BillsService {
	
	constructor() { count =0;}
	// add a new Bill
	async addBill(userName, rawText, Totalquantity, Totalamount, ItemArray) {
		//Todo Fix Code
		// let BillNum=billModel.countDocuments({}, function( err, count){
		// 	return count;
		// });
		// console.log('this be biilnum'+BillNum);
	
		var BillNum=count;
		var bill= await billModel.create({rawText, Totalquantity, Totalamount, BillNum , items:JSON_TO_ItemSchema(ItemArray)});
		UsersService.addBill(userName,bill);
		count++;
		return  bill;
	}

	// find and return a bill by id
	async findById(id) {
		return billModel.findById(id);
	}
}

function JSON_TO_ItemSchema(ItemArray)
{
	var ItemSchemaArray=[];
	let count = Object.keys(JSON.parse(ItemArray)).length;
	for (let index = 0; index < count-1; index++) {
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