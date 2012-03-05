//this is a browser strategy
var drafts = require('./../../drafts');
var Backbone = require("backbone")

var models = {}
models.Toy = Backbone.Model.extend();

var backboneStrategy = require('./../../lib/strategies/backbone');
drafts.setDefaultStrategy(backboneStrategy);

it('creates and saves a simple model', function(){
	drafts.plan(
		{
			'models.Toy': {
				name: function(){ return Faker.Name.findName()}
				
			}
		});

	toy = drafts.models.Toy();
	should.exist(toy);
});

// //the dsl is going to need help, cant deduce everything ... can try
// it('creates embedded documents (using an embedded schema)', function(){
// 	drafts.plan(
// 		{
// 			Toy: {
// 				name: function(){ return Faker.Name.findName()}
// 			}
// 		});

// 	drafts.plan(
// 		{
// 			ToyBox: {
// 				name: function(){ return Faker.Name.findName()},
// 				toys: [Embedded(ToySchema)]
// 			}
// 		});

// 	toybox = drafts.ToyBox();
// 	console.log(toybox);
// 	should.exist(toybox.toys);
// });
