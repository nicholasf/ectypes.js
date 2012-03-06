//this is a browser strategy
var drafts = require('./../../drafts');
var Faker = require('faker');
var should = require('should');

//var $ = require('jquery');
var Backbone = require("backbone");
var Toy = Backbone.Model.extend({url: 'nope'});

var backboneStrategy = require('./../../lib/strategies/backbone');
drafts.setDefaultStrategy(backboneStrategy);

it('creates and saves a simple model', function(){
	drafts.plan(
		{
			Toy: {
				model: Toy,
				name: function(){ return Faker.Name.findName()},
			}
		});

	toy = drafts.Toy();
	should.exist(toy);
});
