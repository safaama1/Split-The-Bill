const express = require('express');
const path = require('path');
const router = express.Router();
const usersService = require('../services/users');

function authorize(req, res, next) {
	if (!req.session.authenticated) {
		return res.redirect(req.baseUrl + '/login');
	}
	next();
}

function ensureLoggedOut(req, res, next) {
	if (req.session.authenticated) {
		req.session.destroy();
	}
	next();
}
/** should return a login page */
router.get('/login', ensureLoggedOut, (req, res) => {
	res.sendFile(path.resolve('pages/login.html'));
});

/** should handle login logic and redirect to homepage if needed */
router.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await usersService.findByName(username);
	if (!user || user.password !== password) {
		return res.redirect('/account/login');
	}
	req.session.authenticated = true;
	req.session.userId = user._id;
	req.session.username = user.username;
	res.redirect(req.baseUrl + '/');
});

/** should return a signup page */
router.get('/signup', ensureLoggedOut, (req, res) => {
	res.sendFile(path.resolve('pages/signup.html'));
});

/** should handle signup logic, log in the user, and redirect to homepage */
router.post('/signup', async (req, res) => {
	const {  email, username, password, passwordAuth } = req.body;
	try {
		if(passwordAuth===password&&validateEmail(email)&&CheckPasswordStrength(password)!=='Red')
		{	
			const user = await usersService.addUser(email, username, password);
			req.session.authenticated = true;
			req.session.id = user._id;
			req.session.username = user.username;
		}		
		res.redirect(req.baseUrl);
	} catch (error) {
		console.log(error);
		res.redirect(req.baseUrl + '/signup');
	}
});

/** should handle logout logic and redirect to homepage */
router.get('/logout', ensureLoggedOut, (req, res) => {
	res.redirect(req.baseUrl);
});

/** should return account page  - only logged in users can see this page */
router.get('/', authorize, async (req, res) => {
	res.sendFile(path.resolve('pages/profile.html'));
});
function validateEmail(email) 
{
	var re = /\S+@\S+\.\S+/;
	return re.test(email);
}
    

function CheckPasswordStrength(password) {

  
	//if textBox is empty
	if(password.length==0){
		
		return 'Red';
	}
  
	//Regular Expressions
	var regex = new Array();
	regex.push('[A-Z]'); //For Uppercase Alphabet
	regex.push('[a-z]'); //For Lowercase Alphabet
	regex.push('[0-9]'); //For Numeric Digits
	regex.push('[$@$!%*#?&]'); //For Special Characters
  
	var passed = 0;
  
	//Validation for each Regular Expression
	for (var i = 0; i < regex.length; i++) {
		if((new RegExp (regex[i])).test(password)){
			passed++;
		}
	}
  
	//Validation for Length of Password
	if(passed > 2 && password.length > 8){
		passed++;
	}
  
	//Display of Status
	var color = '';
	switch(passed){
	case 0:
		break;
	case 1:
		color = 'Red';
		break;
	case 2:
		color = 'darkorange';
		break;
	case 3:
		break;
	case 4:
		color = 'Green';
		break;
	case 5:
		color = 'darkgreen';
		break;
	}
	return color;
}
module.exports = router;