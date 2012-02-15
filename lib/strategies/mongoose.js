var async = require('async');
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

//the default number of embedded documents to create
var collectionCount = 50;

var db = null;

exports.setDB = function(db){
	this.db = db;
	console.log(db.collections);
	console.log(db.models);	
}

exports.setCollectionCount = function(num){
	this.collectionCount = num;
}

exports.create = function(model){
	return new model();
}

exports.save = function(obj){
	return asyncSave(obj);
}

function asyncSave(obj){
		async.series([
		function(cb){
			obj.save(function(err){
				console.log("Drafts.js: ", err);
			});

			cb(null, obj)
		}]);
	
	return obj;
}

exports.resolve = function(drafts, obj, planProperty, propertyValue){
	if (propertyValue instanceof Array){
		embedded = [];

		propertyValue.forEach(function(value){
			//create instance of schema ... 
			console.log('----- ', value);
			console.log("the test >>>", (value instanceof Schema));
			console.log("* >>>>", value);
			model = this.db.model(planProperty, value)
			var count = 0;
			while (count < 50){
				test = new model();

				console.log(">>> ", value, value.constructor.name)
				embedded.push(drafts[value]());
				count++;
			}
		});

		obj[planProperty] = embedded;
		obj =  asyncSave(obj)
	}

	return false;
}
