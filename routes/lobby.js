var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require('fs');
var ejs = require('ejs');

//========================================================================================

var db_room = require('../models/db_room');

var router = express.Router();

router.use(session({
	 secret: 'study_anywhere',
	 resave: false,
	 saveUninitialized: true
}));

//========================================================================================

var userrooms = [];

router.get('/roomList', function(req,res){
	//var currentRoom = Object.keys(io.sockets.adapter.rooms).filter(item => item!=io.sockets.id);
	db_room.getList(userrooms, function(row){
		console.log("in/room : "+row);
		userrooms = row;
		res.send(userrooms);
	});
	
});

router.post('/roomCheck', function(req,res){
	var rname = req.body.rname;
	var rpass = req.body.rpass;
	
	db_room.roomCheck(rname, function(row){
		if(row.roompass == rpass){
			console.log('비번 맞음')
			res.render('room/roomJoin',{ "roomname": rname });
		}else{
			res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
			res.end('<script>alert("비밀번호가 일치하지 않습니다"); window.location="http://localhost:3000/";</script>')
		}
	})
});



//========================================================================================

module.exports = router;

