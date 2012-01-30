var Faker = require('faker');
var should = require('should');
var drafts = require('./../drafts');

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var toySchema = new Schema({
	name: String
});

var toyBoxSchema = new Schema({
    name: String,
    toys: [ToySchema] 
});


var db = mongoose.createConnection('mongodb://host/db')

db.model('Toy', toySchema);
db.model('ToyBox', toyBoxSchema);


var mongooseStrategy = require('./strategies/mongoose');
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

	should.exist(toybox);
//	toybox.name.should.be.a('string');
});