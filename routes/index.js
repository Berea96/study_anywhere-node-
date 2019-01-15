var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var crypto = require('crypto');
var ejs = require('ejs');



//========================================================================================

var db_member = require('../models/db_member');
var db_room = require('../models/db_room');

var router = express.Router();

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
	res.render('lobby.ejs' , {"title": "lobby",
														"member_id": sess.mem_ID,
														"member_hash": sess.mem_Hash});
})

//========================================================================================


module.exports = router;
