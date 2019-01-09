var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var url = require('url');
var crypto = require('crypto');
var socketio = require('socket.io');
var fs = require('fs');
var ejs = require('ejs');



//========================================================================================

var db_member = require('../models/db_member');
var db_room = require('../models/db_room');

var router = express.Router();

router.use(express.static('public'));
router.use(session({
	 secret: 'study_anywhere',
	 resave: false,
	 saveUninitialized: true
}));

//========================================================================================

router.post('/identify', function(req, res){
	var javahash = (req.body.mem_Hash).toString();

	sess = req.session;
	sess.mem_ID = req.body.mem_ID;
	sess.mem_Hash = javahash;


	db_member.hash(req.body.mem_ID, function(data){

		var id = data.member_pw;
		var email = data.member_email;
		var toenc = (id+email).toString();

		var nodehash = crypto.createHash('sha256').update(toenc).digest("hex");

		if(nodehash == sess.mem_Hash){
			res.redirect('/');

		}else {
			res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
			res.end('<script>alert("인증도중 오류가 발생하였습니다."); window.location="http://localhost/Study_Anywhere/";</script>')
		}

	});

});


router.get('/', function(req,res){
	res.render('lobby.ejs' , {"title": "lobby"});
})

//========================================================================================


var userrooms = [];

router.get('/room', function(req,res){
	//res.send(userrooms);
	//var currentRoom = Object.keys(io.sockets.adapter.rooms).filter(item => item!=io.sockets.id);
	//res.send(currentRoom);
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
		if(row == rpass){
			console.log('비번 맞음')
			fs.readFile('routes/canvas.html', 'utf-8', function(err, data){
				res.send(ejs.render(data,{
					room: rname
				}));
			});
		}else{
			res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
			res.end('<script>alert("비밀번호가 일치하지 않습니다"); window.location="http://localhost:3000/";</script>')
		}
	})
});

router.post('/canvas/:name', function(req,res){

});


module.exports = router;
