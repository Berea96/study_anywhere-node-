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
	fs.readFile('views/room/roomEx.ejs', 'utf8', function(err, data){
		if(err) console.log('err'+err);
		res.send(ejs.render(data,{
			'title': '방방방',
			'mem_ID': req.body.mem_ID,
			'roomname': req.body.roomname
		}));
	});
});

router.get('/timer', (req, res) => {
	fs.readFile('views/room/timer.html', 'utf8', function(err, data){
		res.send(ejs.render(data));
	});
});

router.post('/canvas', (req, res) => {
	fs.readFile('views/room/Canvas.html', 'utf8', function(err, data){
		res.send(ejs.render(data,{
			roomname: req.body.roomname
		}));
	});
});


//========================================================================================


module.exports = router;
