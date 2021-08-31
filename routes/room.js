const express = require('express');
const path = require('path');
const router = express.Router();

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

router.get('/:roomId', authorize, (req, res) => {
	res.render('main', { layout: 'billPage', items: billItems() });
});

router.get('/', authorize, (req, res) => {
	res.sendFile(path.resolve('./pages/joinRoom.html'));
});

module.exports = router;
