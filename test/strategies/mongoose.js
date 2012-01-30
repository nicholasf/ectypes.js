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
Toy = db.model('Toy');

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
	console.log("the return of ...", toybox);
	should.exist(toybox);
});

it 
