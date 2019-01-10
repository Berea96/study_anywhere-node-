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


var pageNum ;     
var size = 10;  // 한 페이지에 보여줄 개수
var cnt = userrooms.length;  // 전체 글의 개수
var totalPage = Math.ceil(cnt / size);  // 전체 페이지의 수
var pageSize = 10; // 페이지 링크의 개수   
    
var startPage = (pageNum-1) * size+1;
var endPage = pageNum * size;
if(endPage > totalPage) {
    endPage = totalPage;
}


router.get('/roomList', function(req,res){
	//var currentRoom = Object.keys(io.sockets.adapter.rooms).filter(item => item!=io.sockets.id);
	db_room.getList(userrooms, function(row){
		console.log("in/room : "+row);
		userrooms = row;
		res.send(userrooms);
	});
});


router.get('/roomList/1', function(req,res){
	//var currentRoom = Object.keys(io.sockets.adapter.rooms).filter(item => item!=io.sockets.id);
	db_room.getList(userrooms, function(row){
		console.log("in/room : "+row);
		userrooms = row;
		//res.send(userrooms);
		
		pageNum = 1;
		var rooms = new Array;
		for(var i = startPage-1; i<endPage; i++){
			rooms.push(userrooms[i]);
		}
		
		
		
		var data = {
			"userrooms": rooms,
			"pageNum": pageNum,
			"size": size,
			"cnt": cnt,
			"totalPage": totalPage,
			"pageSize": pageSize,
			"startPage": startPage,
			"endPage": endPage
		}
		
		res.render(data);		
		
	});
	
});

router.post('/roomCheck', function(req,res){
	var rname = req.body.rname;
	var rpass = req.body.rpass;
	console.log(rname);
	console.log(rpass);
	
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


router.get('/existCheck', function(req,res){

	var roomname = req.query.roomname;
	console.log("roomname : "+roomname);

	db_room.existCheck(roomname, function(result){
		console.log("result"+result);
			var out = '';
			out += '{ \"result\": '; 
			if(!result){
				out+= '\"yes\"';
			}else{
				out+= '\"no\"';
			}
			out+= ' }';
			console.log(out);
		res.end(out);
		
	})

})


//========================================================================================

module.exports = router;

