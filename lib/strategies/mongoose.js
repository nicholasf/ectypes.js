var async = require('async');

var db = null;

exports.setDB = function(db){
	this.db = db;
}

exports.create = function(model){
	instance = new model();

	async.series([
		function(cb){

			instance.save(function(err){
				console.log("Drafts.js: ", err);
			});

			cb(null, instance)
		}]
		// ,
		// function(err, result){
		// 	console.log(result[0]);
		// 	// return result[0];
		// }
	);

	return instance;
}

exports.save = function(obj){
	async.series([
		function(cb){
			obj.save(function(err){
				console.log("Drafts.js: ", err);
			});

			cb(null, obj)
		}]);
	
	return obj;
}


//note this resolution returns NOTHING, so it will swallow all functions mapped to properties
exports.resolve = function(obj, planProperty){
	return true;
}
