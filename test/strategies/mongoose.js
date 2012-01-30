var Faker = require('faker');
var should = require('should');
var drafts = require('./../../drafts');

//configure Mongoose
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var ToySchema = new Schema({
	name: String
});

var ToyBoxSchema = new Schema({
    name: String,
    toys: [ToySchema] 
});


var db = mongoose.createConnection('mongodb://localhost/draftsjs-test');

db.model('Toy', ToySchema);
db.model('ToyBox', ToyBoxSchema);

ToyBox =  db.model('ToyBox');
// toybox = new ToyBox();

// async = require('async');
// async.series([
// 	function(cb){

// 		toybox.save(function(err){
// 			console.log("Drafts.js: ", err);
// 		});

// 		cb(null, toybox)
// 	}],
// 	function(err, result){
// 		console.log(result[0]);
// 	}
// );

// console.log("-------- ---------");

var mongooseStrategy = require('./../../lib/strategies/mongoose');
mongooseStrategy.setDB(db)
drafts.setDefaultStrategy(mongooseStrategy);


it('creates a simple model', function(){
	drafts.plan(
		{
			ToyBox: {
				name: Faker.Name.findName()
			}
		});

	toybox = drafts.ToyBox();
	console.log("the return of ...", toybox);
	should.exist(toybox);
});
