
var mysql = require('mysql');
var config = require('../models/db_config');
var pool = mysql.createPool(config);


exports.hash = function (id, callback) {
	  pool.getConnection(function (err, conn) {
	    if (err) console.log('err', err);
	    var sql = 'select member_pw, member_email from member where member_id = ?';
	    conn.query(sql , [id], function (err, row) {
	      if (err) console.log('err', err);
	        callback(row[0]);
	        conn.release();
	      });
	    });
	  };


	  exports.addchatlist = function (data, callback) {
		  pool.getConnection(function (err, conn) {
		    if (err) console.log('err', err);
		    var sql = 'insert into chatlist values( ? , ? , ? )';
		    conn.query(sql , [data.roomname,data.username,data.chief], function (err, result) {
		      if (err) console.log('err', err);
		        callback(result);
		        conn.release();
		      });
		    });
		  };

		  exports.getchatlist = function (data, callback) {
			  pool.getConnection(function (err, conn) {
			    if (err) console.log('err', err);
			    var sql = 'select member_id from chatlist where roomname = ? ';
			    conn.query(sql , data , function (err, row) {
			      if (err) console.log('err', err);
			      var list = [];
			      for(var i = 0; i<row.length; i++){
			    	  list.push(row[i].member_id);
			      }
			      
			        callback(list);
			        conn.release();
			      });
			    });
			  };

			  exports.delchatlist = function (data, callback) {
				  pool.getConnection(function (err, conn) {
				    if (err) console.log('err', err);
				    var sql = 'delete from chatlist where member_id = ? ';
				    conn.query(sql , data, function (err, result) {
				      if (err) console.log('err', err);
				        callback(result);
				        conn.release();
				      });
				    });
				  };