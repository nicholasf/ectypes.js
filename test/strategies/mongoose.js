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

db.model('ToyBox', ToyBoxSchema);
ToyBox =  db.model('ToyBox');

var mongooseStrategy = require('./../../lib/strategies/mongoose');
mongooseStrategy.setDB(db)

drafts.setDefaultStrategy(mongooseStrategy);

it('creates and saves a simple model', function(){
	drafts.plan(
		{
			ToyBox: {
				name: function(){ return Faker.Name.findName()}
			}
		});

	toybox = drafts.ToyBox();
	should.exist(toybox);
});

//the dsl is going to need help, cant deduce everything ... can try
it('creates embedded documents (using an embedded schema)', function(){
	drafts.plan(
		{
			Toy: {
				name: function(){ return Faker.Name.findName()}
			}
		});

	drafts.plan(
		{
			ToyBox: {
				name: function(){ return Faker.Name.findName()},
				toys: [Embedded(ToySchema)]
			}
		});

	toybox = drafts.ToyBox();
	console.log(toybox);
	should.exist(toybox.toys);
});
