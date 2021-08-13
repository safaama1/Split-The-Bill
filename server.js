const express = require('express');
const app = express();
const path = require('path');
// eslint-disable-next-line no-unused-vars
const usersService = require('./services/users');

app.use('/assets', express.static('static-assets'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017', {
	dbName: 'myApp',
	auth: {
		user: 'root',
		password: 'example',
		authdb: 'admin'
	},
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,

});
app.get('/', (req, res) => {
	res.sendFile(path.resolve('main.html'));
});

app.get('/main.html', (req, res) => {
	res.sendFile(path.resolve('main.html'));
});

app.get('/logIn.html', (req, res) => {
	res.sendFile(path.resolve('logIn.html'));
});

app.get('/signUp.html', (req, res) => {
	res.sendFile(path.resolve('signUp.html'));
});

app.listen(3000);
