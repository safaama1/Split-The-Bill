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

const billItems = () => {
	return [
		[
			'Item',
			'Qty',
			'Price',
			'Amt'
		],
		[
			'Moto M',
			'2',
			'18000.00',
			'32,400.00'
		],
		[
			'Moto X',
			'1',
			'25000.00',
			'22,500.00'
		],
		[
			'service',
			'1',
			'100000',
			'1,000.00'
		],
		[
			'Mato Turbo',
			'1',
			'20000',
			'200.00'
		],
		[
			'Mato Original',
			'1',
			'50000',
			'500.00'
		],
		[
			'SubTotal',
			'6',
			'56,600.00'
		]
	];
};

router.get('/api',async (req, res) => {
	res.redirect(307,req.baseUrl + '/0');
});
router.post('/api', async (req, res) => {
	const { rawText, Totalquantity, Totalamount, items } = req.body;
	try {
		const bill = await billService.addBill(req.session.username, rawText,parseFloat( Totalquantity.replace(/,/g, ''), 10), parseFloat(Totalamount.replace(/,/g, ''),10), items);
		return res.redirect(307,req.baseUrl + '/0');
	} catch (error) {
		console.log(error);
	}
});
router.get('/:roomId', authorize, (req, res) => {
	res.render('main', { layout: 'billPage', items: billItems() });
});

router.get('/', authorize, (req, res) => {
	res.sendFile(path.resolve('./pages/joinRoom.html'));
});

module.exports = router;
