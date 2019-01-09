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

//라우트 추가
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var db_room = require('./models/db_room');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//========================================================================================









var userrooms = [];

io.sockets.on('connect', function(socket){
	var roomId = "";

/*	var userroom = {
			userid: string,
			roomname: string,
			roompass: string,
			roommaxp: int,
			roomcurp: int
	}*/



	socket.on('join', function(data){
		console.log('data at join : '+data);

		roomId = data;
		socket.join(data);
		

		for(var item in userrooms){

			if(userrooms[item].roomname == data){
				if(userrooms[item].roomcurp >=10){
					console.log("if");
					return;
				}else{
					userrooms[item].roomcurp += 1;
					console.log(userrooms[item].roomcurp);

					socket.join(data);
					roomId = data;

					io.sockets.in(roomId).emit('getImage', "");
					socket.on('getImage', (data) => {
						console.log('image save..........')
						io.sockets.in(roomId).emit('setImage', data);
					});
				}
			}
			else{
				console.log("else")
			}
		}

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

		db_room.existCheck(data.roomname, function(row){
			roomexist = row;
		})

		if(!roomexist){
			socket.leave(socket.room);
			//socket.join(data.roomname);
			socket.room = data.roomname;
			data.rcode = 0;

			var room = {
					userid: data.userid,
					roomname: data.roomname,
					roompass: data.roompass,
					roommaxp: data.roommaxp,
					roomcurp: 0
				};

			db_room.createRoom(room, function(row){
				console.log(row);
			});

		}else{
			data.rcode = 1;
		}

		if(data.rcode == 0){
			console.log(data);
		socket.emit('onCreateRoom', data)
		}else{
			console.log('기존 방있음');
		}
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
