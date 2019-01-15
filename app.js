//모듈 추가
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var express = require('express');
var socketio = require('socket.io');
var session = require('express-session');
var bodyParser = require('body-parser');

//========================================================================================

//웹 서버와 소켓 서버를 생성
var app = express();
var io = socketio();
var server = require('http').createServer(app);
//소켓 서버를 웹 서버에 연결
io.attach(server);

//서버 실행
var port = 3000;
server.listen(port, function(){
	console.log('server running at http://localhost:'+port);
});

//========================================================================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//라우터 추가
var indexRouter = require('./routes/index');
var lobbyRouter = require('./routes/lobby');
var roomRouter = require('./routes/room');

var db_room = require('./models/db_room');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/lobby', lobbyRouter);
app.use('/room', roomRouter);

//========================================================================================

var userrooms = [];
var user = [];

io.sockets.on('connect', function(socket){
	var roomId = "";
	var name = "";

	if(name === "") {
		name = sess.member_ID;
	}
	else
		name = name;
/*	var userroom = {
			userid: string,
			roomname: string,
			roompass: string,
			roommaxp: int,
			roomcurp: int
	}*/
	socket.on('user', (data) => {
		socket.emit('user', name);
	});

	socket.on('join', function(data){
		console.log('data at join : '+data);

		db_room.getList(data, function(row){
			userrooms = row;
			var result = 0;

			function wheretogo(){
				for(var item in userrooms){
					if(userrooms[item].roomname == data){
						result+=1;
					}
				}
			}

			if(result != 1){

				roomId = data;
				socket.leave(socket.room);
				socket.join(data);
				socket.room = data;

				io.sockets.in(roomId).emit('getImage', "");
				socket.on('getImage', (data) => {
					console.log('image save..........')
					io.sockets.in(roomId).emit('setImage', data);
				});


				var destination = 'http://localhost:3000/room';
				var redirect ={
					"bool": true,
					"method": "POST",
					"destination": destination
				}
				socket.emit('redirect', redirect);

			}else{

				console.log('오류발생 ');

				var destination = 'http://localhost:3000';
				var redirect ={
						"bool": false,
						"method": "GET",
						"destination": destination
				}
				socket.emit('redirect', redirect);
			}
		});

	});

	socket.on('login', (data) => {
		//console.log('Client logged-in: \n name: ' + sess.mem_ID + '\n userid: ' + data.userid);

		roomId = data.roomname;

		//socket.leave(socket.room);
		socket.join(roomId);
		socket.name = data.name;
		name = socket.name;
		user.push(socket.name);
		socket.userid = data.userid;
		socket.room = data;

		console.log(roomId);

		io.sockets.in(roomId).emit('getUser', socket.name);
	});

	socket.on('joinUser', (data) => {
		console.log(roomId + "방 현재 " + user.length + "명 접속 중");
		io.sockets.in(roomId).emit('login', user);
	});

	socket.on('getTime', (data) => {
		var currentTime = new Date();

		io.sockets.in(roomId).emit('setTime', "");
	});

	socket.on('chat', (data) => {
		console.log('Message from %s: %s', socket.name, data.msg);

		var msg = {
			from: {
				name: socket.name,
				userid: socket.userid
			},
			msg: data.msg
		};

		io.sockets.in(roomId).emit('chat', msg);
	});

	socket.on('draw', function(data){
		io.sockets.in(roomId).emit('line', data);
	});

	socket.on('clearAll', (data) => {
		io.sockets.in(roomId).emit('clearAll', data);
	});

	socket.on('onCreateRoom', function(data){
		console.log('on server onCreateRoom')

		var roomexist = false;
/*		for(var item in userrooms){
			if(data.roomname == userrooms[item].roomname){
				roomexist = true;
			}
		}*/

		db_room.existCheck(data.roomname, function(result){
			roomexist = result;

			if(!roomexist){
				socket.leave(socket.room);
				//socket.join(data.roomname);
				socket.room = data.roomname;
				data.rcode = 0;

				var room = {
						userid: data.userid,
						roomname: data.roomname,
						roompass: data.roompass,
					};

				db_room.createRoom(room, function(row){
					console.log(row);
				});

			}else{
				data.rcode = 1;
			}

			if(data.rcode == 0){
			socket.emit('onCreateRoom', data)
			}else{
				console.log('기존 방있음');
			}
		})
	});

	socket.on('forceDisconnect', () => {
		socket.disconnect();
	});

	socket.on('disconnect', function(){
		//delete usernames[socket.username];
		//var userlist = new Array();
		/*for (var name in usernames) {
			userlist.push(usernames[name]);
		}
		io.sockets.emit('updateuser', userlist);
		socket.broadcast.emit('servernoti', 'red', socket.username + ' has disconnected');

		var roomname = socket.room;
		console.log('여기 디스커넥션'+socket.room);*/
		for(var i = 0; i < user.length; i++) {
			if(user[i] === name) {
				user.splice(i, 1);
				break;
			}
		}
		console.log(name + " : disconnected");
		io.sockets.in(roomId).emit("exit", {"name": name});
		socket.leave(socket.room);
	});
})









//========================================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//========================================================================================


//module.exports = app;
