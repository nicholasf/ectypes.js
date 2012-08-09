var drafts = require('./../../drafts');
var Faker = require('faker');
var should = require('should');

var Backbone = require("backbone");
var Toy = Backbone.Model.extend({url: 'nope'});
var Toys = Backbone.Collection.extend({model: Toy});

var backboneStrategy = require('./../../lib/strategies/backbone');
drafts.setDefaultStrategy(backboneStrategy);

// it('creates and saves a simple model', function(){
// 	drafts.plan(
// 		{
// 			Toy: {
// 				model: Toy,
// 				name: function(){ return Faker.Name.findName()},
// 			}
// 		});

// 	toy = drafts.Toy();
// 	should.exist(toy);
// });

// it('creates a collection', function(){
// 	drafts.plan(
// 		{
// 			Toys: {
// 				collection: Toy,
// 				name: function(){ return Faker.Name.findName()},
// 			}
// 		});

// 	toys = drafts.Toys();
// 	should.exist(toys);
// });

it('creates a collection filled with the corresponding model (if the model has been planned)', function(){
	drafts.plan(
		{
			Toy: {
				model: Toy,
				name: function(){ return Faker.Name.findName()},
			},

			Toys: {
				collection: Toys,
				name: function(){ return Faker.Name.findName()},
			}
		});

	col = new Toys();

	toys = drafts.Toys();
	console.log(toys);
	should.exist(toys.models);

});

