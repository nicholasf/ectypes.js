var Faker = require('faker');
var should = require('should');
var drafts = require('./../drafts');

// it('creates a plan for a vanilla object that can be used as a draft', function(){
// 	drafts.plan(
// 		{
// 			post: {
// 				username: function(){ return Faker.Name.findName()}
// 			}
// 		});

// 	should.exist(drafts.post());
// 	drafts.post.username.should.be.a('string');
// });

it('creates a plan for a standard object that can be used as a draft', function(){
	drafts.plan(
		{
			String: {
				name: function(){ return Faker.Name.findName()}	
			},
		});

	str = drafts.String();
	should.exist(str);
	should.exist(str.name)
});

describe("Strategies ...", function(){
	it("supports strategy specific object creation", function(){
		var testStrategy = require('./strategies/test');
		drafts.setDefaultStrategy(testStrategy);

		drafts.plan(
			{
				String: {},
			});
			
		var str = drafts.String();		
		str.should.have.property("savedBy", "The Drafts Test Strategy(tm)");
	});

	it("default strategies are set and used to construct the object", function(){
		var testStrategy = require('./strategies/test');
		drafts.setDefaultStrategy(testStrategy);

		drafts.plan(
			{
				String: {
					name: function(){ return Faker.Name.findName()}	
				},
			});
		
		var str = drafts.String();

		str.should.have.property("savedBy", "The Drafts Test Strategy(tm)");
		testStrategy.report().String.resolutions.should.eql(1);
	});
});