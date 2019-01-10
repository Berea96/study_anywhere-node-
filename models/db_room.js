var mysql = require('mysql');
var config = require('../models/db_config');
var pool = mysql.createPool(config);

exports.createRoom = function(data, callback) {
	pool
			.getConnection(function(err, conn) {
				if (err)
					console.log('err', err);
				var sql = 'insert into room(roomname, roompass, userid) values( ? , ? , ? );';
				conn.query(sql, [ data.roomname, data.roompass, data.userid ],
						function(err, result) {
							if (err)
								console.log('err', err);
							console.log(result);

							var success = false;

							if (result.affectedRows == 1) {
								success = true;
							}
							conn.release();
							// 요청한 곳에 callback함수를 돌려준다.
							callback(success);

						});
			});
};

exports.existCheck = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err)
			console.log('err', err);
		var sql = 'select roomname from room where roomname=?';
		conn.query(sql, [ data.roomname ], function(err, row) {
			if (err)
				console.log('err', err);
			console.log(row);

			var success = false;

			if (row.affectedRows == 1) {
				success = true;
			}
			conn.release();
			// 요청한 곳에 callback함수를 돌려준다.
			callback(success);

		});
	});
};

exports.getList = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err)
			console.log('err', err);
		var sql = 'select * from room;';
		conn.query(sql, function(err, result) {
			if (err)
				console.log('err', err);
			console.log("in getList: " + result);

			callback(result);
			conn.release();

		});
	});
};

exports.roomCheck = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'select roompass, roomcurp from room where roomname= ?;';
		conn.query(sql, data , function(err, result) {
			if (err) console.log('err', err);
			console.log(result[0]);

			callback(result[0]);
			conn.release();

		});
	});
};

exports.curpUP = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'update room set roomcurp = roomcurp + 1 where roomname = ? ;';
		conn.query(sql, [data] , function(err, result) {
			if (err) console.log('err', err);

			console.log(result);

			var success = false;

			if (result.affectedRows == 1) {
				success = true;
			}
			conn.release();
			// 요청한 곳에 callback함수를 돌려준다.
			callback(success);

		});
	});
};

exports.roomcurp = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'select roomcurp from room where roomname = ? ;';
		conn.query(sql, [data] , function(err, result) {
			if (err) console.log('err', err);

			var success = true;
			if (typeof(result[0].roomcurp) != 'undefined') {
				console.log("이놈이 항상문제"+result[0].roomcurp);
			}


/*			if (result[0].roomcurp == 0) {
				success = false;
			}*/
			conn.release();
			// 요청한 곳에 callback함수를 돌려준다.
			callback(success);

		});
	});
};

exports.curpDN = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'update room set roomcurp = roomcurp - 1 where roomname = ? ;';
		conn.query(sql, [data] , function(err, result) {
			if (err) console.log('err', err);

			console.log("이제는 여기 값을 알아내봅시다"+data);

			var success = false;

			if (result.affectedRows == 1) {
				success = true;
			}
			conn.release();
			// 요청한 곳에 callback함수를 돌려준다.
			callback(success);

		});
	});
};
