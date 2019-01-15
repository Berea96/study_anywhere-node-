var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var ejs = require('ejs');
var opn = require('opn');

//========================================================================================

var db_room = require('../models/db_room');

var router = express.Router();

router.use(express.static('public'));
router.use(session({
	 secret: 'study_anywhere',
	 resave: false,
	 saveUninitialized: true
}));

//========================================================================================


router.post('/', function(req, res){
	console.log(req.body.roomname);
	res.render('roomEx.ejs' , {"roomname": req.body.roomname,
														 "title": "room",
													 	 "name": sess.mem_ID});

	//fs.readFile('views/Canvas.html', 'utf8', function(err, data){
		// res.send(ejs.render(data,{
		// 	room: req.body.roomname
		// }));
	// });
});

router.get('/join', function(req,res){
	opn('http://localhost:3000/room/canvas', {room: req.body.roomname});
	console.log("");
	return;
});

router.post('/join', function(req,res){
	opn('http://localhost:3000/room/canvas', {room: req.body.roomname});
	console.log("");
	return;
});
router.post('/canvas', (req, res) => {
	fs.readFile('views/Canvas.html', 'utf8', function(err, data){
		res.send(ejs.render(data,{
			room: req.body.roomname
		}));
	});
});

router.get('/timer', (req, res) => {
	fs.readFile('views/timer.html', 'utf8', function(err, data){
		res.send(ejs.render(data,{
			room: req.body.roomname
		}));
	});
});

router.post('/timer', (req, res) => {
	fs.readFile('views/timer.html', 'utf8', function(err, data){
		res.send(ejs.render(data,{
			room: req.body.roomname
		}));
	});
});


//========================================================================================

module.exports = router;
