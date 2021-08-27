const express = require('express');
const path = require('path');
const router = express.Router();
// console.log('here');

function authorize(req, res, next) {
	if (!req.session.authenticated) {
		return res.redirect('/account/login');
	}
	next();
}

router.get('/', authorize ,(req, res) => {
	// console.log('here');
	res.sendFile(path.resolve('./pages/joinRoom.html'));
});

module.exports = router;