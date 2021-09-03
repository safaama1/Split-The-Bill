var input = document.getElementById('image');
//var progress=document.getElementById('progress');
//define and initiate FRL ,first relevant elements
var FRES = [];
function initiate_FRES() {
	FRES.push('Item');
	FRES.push('item');
}
initiate_FRES();
var LRES = [];
function initiate_LRES() {
	LRES.push('SubTotal');
	LRES.push('Subtotal');
	LRES.push('subtotal');
	LRES.push('subTotal');
}
initiate_LRES();
//checks if array has an elemnt that is in FRES
// eslint-disable-next-line no-unused-vars
function isInFRES(newString) {
	return FRES.includes(newString);
}
//checks if array has an elemnt that is in LRES
// eslint-disable-next-line no-unused-vars
function isInLRES(newString) {
	return LRES.includes(newString);
}
//checks if array starts with an elemnt that is in FRES
function startsWithFRES(array) {
	for (let index = 0; index < FRES.length; index++) {

		if (array.startsWith(FRES[index]))
			return true;

	}
	return false;
}
//uses tesseract.js to identify text in the image provided by the user then activates the function parse bill
async function recognizeBill() {
	var billData = [];
	// eslint-disable-next-line no-undef

	//	await Tesseract.recognize(input.files[0],'eng',{ preserve_interword_spaces: 1,logger:m =>{progress.innerHTML=m['progress'].toFixed(3); }}).then(result=>{
	await Tesseract.recognize(input.files[0], 'eng', { preserve_interword_spaces: 1 }).then(result => {
		billData.push(result.data.text);
		return result.data.text.split('\n');
	}).then(result => {
		billData.push(parseBill(result));
		return parseBill(result);
	}).catch((err) => {
		console.log(err.message);
	});

	//TODO replace numbers with constants

	//total quantity i.e. number of items overall
	billData.push(billData[1][billData[1].length - 1][1]);
	//total price i.e. the price of all items combined
	billData.push(billData[1][billData[1].length - 1][2]);

	billData[1].pop();

	billData[1].shift();

	return billData;
}
//checks if a string represents a number for example: ('127' => true) ('2h1e'=>false) (22=>false (not a string))
function isNumeric(str) {
	if (typeof str != 'string') return false; // we only process strings!  
	return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!isNaN(parseFloat(str)); // ...and ensure strings of whitespace fail
}
//returns the number of strings that aren't Numeric in the beginning of the arrray (['moto', 'g', '2', '1500', '3000']  => 2 )
function numOfLeadingWords(array) {
	let count = 0;
	for (let index = 0; index < array.length; index++) {
		if (!isNumeric(array[index]))
			count++;
		else
			break;
	}
	return count;
}
//merge all text in the begging of an array i.e. (['moto', 'g', '2', '1500', '3000']  => ['moto g', '2', '1500', '3000'] )
function mergeNthFirstElements(array, N, delemiter) {
	let newArr = [];
	for (let index = N; index < array.length; index++) {
		newArr.push(array[index]);
	}
	let temp = '';
	for (let i = 0; i < N - 1; i++) {
		temp = temp + array[i] + delemiter;
	}
	//TODO check if N value is legal
	temp = temp + array[N - 1];
	newArr.unshift(temp);
	return newArr;
}
function indexOfFres(array) {

	for (let index = 0; index < array.length; index++) {
		if (startsWithFRES(array[index]) === true) {
			return index;
		}
	}
	//TODO change to err
	return -1;
}
function parseBill(array) {
	let fields = [];
	//find the first relevant line aka the line that usualy begins with Item
	let start = indexOfFres(array);
	fields = array[start].split(' ').filter(e => e);
	let parsedItem = [];
	let listofFinalItems = [];
	listofFinalItems.push(fields);
	//go over every line of unparsed text
	for (let index = start + 1; index < array.length; index++) {
		//parse line using delimiter ' '
		parsedItem = array[index].split(' ').filter(e => e);
		//merge all text in the begging of an array i.e. (['moto', 'g', '2', '1500', '3000']  => ['moto g', '2', '1500', '3000'] )
		listofFinalItems.push(mergeNthFirstElements(parsedItem, numOfLeadingWords(parsedItem), ' '));
		if (isInLRES(parsedItem[0]))
			break;
	}
	return listofFinalItems;
}
//when a user adds an image the function parseBill is activated
async function loadEdit() {
	var billDetails = recognizeBill();
	return billDetails;
}

input.addEventListener('change', () => {
	loadEdit().then(((billDetails) => {

		if (!input.files) {
			return null;
		}

		const rawText = billDetails[0];
		const Totalquantity = billDetails[2];
		const Totalamount = billDetails[3];
		const items = JSON.stringify(Object.assign({}, billDetails[1]));
		console.log(billDetails);

		const data = { rawText, Totalquantity, Totalamount, items };
		const url = '/account/room/api';
		const options = {
			method: 'POST',
			redirect: 'follow',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};
		fetch(url, options).then(response =>{
			// take the url that the redirect sent in the server side
			window.location.href = response.url;
		});
	}));
}, false);