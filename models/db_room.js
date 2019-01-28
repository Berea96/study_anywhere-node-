var mysql = require('mysql');
var config = require('../models/db_config');
var pool = mysql.createPool(config);

exports.createRoom = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'insert into room(roomname, roompass, userid) values( ? , ? , ? );';
		conn.query(sql, [ data.roomname, data.roompass, data.userid ], function(err, result) {
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

exports.existCheck = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'select roomname from room where roomname=?';
		conn.query(sql, [ data ], function(err, row) {
			if (err) console.log('err', err);
			console.log(row);

			var success = false;

			if (row[0] != null ) {
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
		var sql = 'select * from room where roomname not in(\'lobby\');';
		conn.query(sql, function(err, result) {
			if (err)
				console.log('err', err);
			//console.log("in getList: " + result);

			callback(result);
			conn.release();

		});
	});
};

exports.roomCheck = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'select roompass from room where roomname= ?;';
		conn.query(sql, data , function(err, result) {
			if (err) console.log('err', err);
			console.log(result[0]);

			callback(result[0]);
			conn.release();

		});
	});
};

exports.searchRname = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'select roomname, userid from room where roomname like "%'+data+'%";';
		conn.query(sql , function(err, result) {
			if (err) console.log('err', err);
			console.log(result);

			callback(result);
			conn.release();

		});
	});
};

exports.searchRid = function(data, callback) {
	pool.getConnection(function(err, conn) {
		if (err) console.log('err', err);
		var sql = 'select roomname, userid from room where userid like "%'+data+'%";';
		conn.query(sql , function(err, result) {
			if (err) console.log('err', err);
			console.log(result);

			callback(result);
			conn.release();

		});
	});
};
