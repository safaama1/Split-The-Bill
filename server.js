/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
const accountRouter = require('./routes/account');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

io.sockets.on('connection', function(socket) {

	socket.on('join', function(room) {
		socket.join(room);
		//console.log('socket joined room no.'+room);

		socket.on('choseItem', function(user, item_id, quantity ){
			io.to(room).emit('update_items',user, item_id, quantity);

		});
		
	});
	socket.on('disconnect', () => {
		//console.log('user disconnected');
	});
});


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

app.set('view engine', 'hbs');

app.engine('hbs', handlebars({
	layoutsDir: `${__dirname}/views/layouts`,
	extname: 'hbs',
	defaultLayout: 'billPage'
}));

// helpful handlebars functions (used in file billPage.hbs)
var hbs = handlebars.create({});

// function that creates a loop that executes 'n' times 
// #times 12 (same as)=> for(i=0 ; i < 12 ; i++)  
hbs.handlebars.registerHelper('times', function (n, block) {
	var accum = '';
	for (var i = 0; i < n; ++i)
		accum += block.fn(i);
	return accum;
});

// function that increases the value of 'value' by one
// #inc 4 (same as)=> 4++
hbs.handlebars.registerHelper('inc', function (value, options) {
	return parseInt(value) + 1;
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

const roomRouter = require('./routes/room');
app.use('/account/room', roomRouter);

app.use('/account', accountRouter);
app.get('/', (req, res) => res.sendFile(path.resolve('pages/main.html')));
app.use('/', (req, res) => res.sendStatus(404));

// app.listen(3000);
server.listen(3000, () => {
});
