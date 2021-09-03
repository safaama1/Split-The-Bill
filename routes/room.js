const express = require('express');
const path = require('path');
const router = express.Router();
const billService = require('../services/Bill');
const Bills = require('../models/Bill');
router.use(express.json());

function authorize(req, res, next) {
	if (!req.session.authenticated) {
		return res.redirect('/account/login');
	}
	next();
}

router.post('/api', async (req, res) => {
	const { rawText, Totalquantity, Totalamount, items } = req.body;
	try {
		const bill = await billService.addBill(req.session.username, rawText, parseFloat(Totalquantity.replace(/,/g, ''), 10), parseFloat(Totalamount.replace(/,/g, ''), 10), items);
		if (!bill) {
			return res.redirect('/account/login');
		}
		req.session.authenticated = true;
		req.session.userId = bill._id;
		res.redirect(req.baseUrl + '/' + bill._id);

	} catch (error) {
		console.log(error);
	}
});

router.get('/:roomId', authorize, async (req, res) => {
	const { roomId } = req.params;
	if (!roomId) {
		return res.sendStatus(400); // bad request
	}
	const bill = await Bills.findById(roomId).lean();
	const billItems = () => {
		return bill.items ;
	};
	res.render('main', { layout: 'billPage', items: billItems() });
});

router.get('/', authorize, (req, res) => {
	res.sendFile(path.resolve('./pages/joinRoom.html'));
});

module.exports = router;
