const express = require('express');
const path = require('path');
const accountRouter = require('./routes/account');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
app.use('/assets', express.static('static-assets'));
mongoose.connect('mongodb://localhost:27017', {
	dbName: 'SplitTheBill',
	auth: {
		user: 'root',
		password: 'example',
		authdb: 'admin'
	},
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,

});


// cookie parsing middleware 
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// session middleware to store user information in an encrypted cookie
app.use(session({
	name: 'session-cookie',
	secret: 'secret string used to encrypt the cookie',
	cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 },
	resave: false,
	saveUninitialized: false
}));

app.use('/account', accountRouter);
app.get('/', (req, res) => res.sendFile(path.resolve('pages/main.html')));
app.use('/', (req, res) => res.sendStatus(404));

app.listen(3000);
