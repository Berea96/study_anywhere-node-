var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var ejs = require('ejs');
var dateFormat = require('dateformat');

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
			'title': '스터디룸',
			'mem_ID': req.body.mem_ID,
			'roomname': req.body.roomname,
			'chief': req.body.chief
		}));
	});
});

router.get('/timer', (req, res) => {
	fs.readFile('views/room/timer.html', 'utf8', function(err, data){
		res.send(ejs.render(data));
	});
});

router.get('/canvas', (req, res) => {
	fs.readFile('views/room/Canvas.html', 'utf8', function(err, data){
		res.send(ejs.render(data,{
			roomname: req.query.roomname
		}));
	});
});

router.get('/clock', (req, res) => {

	var d = new Date();

	//res.send(dateFormat(d, "dddd, mmmm dS, yyyy, h:MM:ss TT").toString());
	res.send(d);

});

//========================================================================================


module.exports = router;
