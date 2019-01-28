var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var crypto = require('crypto');
var ejs = require('ejs');



//========================================================================================

var db_member = require('../models/db_member');
var db_room = require('../models/db_room');

var router = express.Router();

//=========================
var url = 'localhost';
//=========================

//========================================================================================

router.post('/identify', function(req, res){
	var javahash = (req.body.mem_Hash).toString();
	
	var sess = req.session;
	sess.mem_ID = req.body.mem_ID;
	sess.mem_Hash = javahash;

	console.log(sess.mem_ID);
	console.log(sess.mem_Hash);

	
	db_member.hash(req.body.mem_ID, function(data){
		
		var pw = data.member_pw;
		var email = data.member_email;
		var toenc = (pw+email).toString();
		
		var nodehash = crypto.createHash('sha256').update(toenc).digest("hex");
		
		if(nodehash == sess.mem_Hash){
			console.log('Right')
			res.redirect('http://'+url+':3000/');
		}else {
			res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
			res.end('<script>alert("인증도중 오류가 발생하였습니다."); window.location="http://'+url+'/Study_Anywhere/";</script>')
		}
		
	});
	
});


router.get('/', function(req,res){
	res.render('lobby.ejs' , {'mem_ID': req.session.mem_ID });
	//res.redirect('./lobby/roomList/1');
})

//========================================================================================


module.exports = router;
