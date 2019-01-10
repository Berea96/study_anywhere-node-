var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var ejs = require('ejs');

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
	fs.readFile('views/Canvas.html', 'utf8', function(err, data){
		res.send(ejs.render(data,{
			room: req.body.roomname
		}));
	});
});

router.get('/join', function(req,res){
	console.log(roomname, roompass);
});


//========================================================================================

module.exports = router;

