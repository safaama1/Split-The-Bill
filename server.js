const express = require('express');
const app = express();
// eslint-disable-next-line no-unused-vars
const path = require('path');
app.use('/assets', express.static('static-assets'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017',{
	dbName:'myApp',
	auth:{
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

app.get('/signup', (req, res) => {
	res.sendFile(path.resolve('SignUp.html'));
});

app.listen(3000);
