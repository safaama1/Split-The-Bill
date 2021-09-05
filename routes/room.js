const express = require('express');
const path = require('path');
const router = express.Router();
const billService = require('../services/Bill');
router.use(express.json());

function authorize(req, res, next) {
	if (!req.session.authenticated) {
		return res.redirect('/account/login');
	}
	next();
}

router.post('/api', async (req, res) => {
	try {
		const { rawText, Totalquantity, Totalamount, items } = req.body;

		const bill = await billService.addBill(req.session.username, rawText, parseFloat(Totalquantity.replace(/,/g, ''), 10), parseFloat(Totalamount.replace(/,/g, ''), 10), items);

		if (!bill) {
			return res.redirect('/account/login');
		}
		req.session.authenticated = true;
		req.session.userId = bill._id;
		res.redirect(req.baseUrl + '/' + bill.BillNum);

	} catch (error) {
		console.log(error);
		return res.redirect('/account/login');
	}
});
//todo check if this user is the owner of bill first i.e. the one who scanned it 
//deletes bill with billnum equal to roomid
router.get('/del/:roomId', authorize, async (req, res) => {
	try{
		//get Bill that has Billnum equal to room Id
		const { roomId } = req.params;
		await billService.deleteByBillNum(parseInt(roomId,10));
		res.sendFile(path.resolve('./pages/joinRoom.html'));
	}	
	catch(error){
		console.log(error);
		return res.sendStatus(400); // bad request
	}
});

//reroutes user to the romm with index room_id
router.post('/routeRoom', authorize, async (req, res) => {
	try{
		const { room_id } = req.body;
		res.redirect(req.baseUrl + '/'+ room_id);
	}
	catch(error){
		console.log(error);
		return res.sendStatus(400); // bad request
	}
});


router.get('/:roomId', authorize, async (req, res) => {
	try{
		//get Bill that has Billnum equal to room Id
		const { roomId } = req.params;

		let BillDocument=await billService.findByBillNum(roomId);

		//convert BillDocument to js object pogos so that handelbars is able to use it 
		let bill=JSON.parse(JSON.stringify(BillDocument));

		const billItems = () => {
			return bill.items ;
		};
		res.render('main', { layout: 'billPage', userName:req.session.username ,items: billItems() });
	}
	catch(error){
		console.log(error);
		return res.sendStatus(400); // bad request
	}
});



router.get('/', authorize, (req, res) => {
	res.sendFile(path.resolve('./pages/joinRoom.html'));
});

module.exports = router;