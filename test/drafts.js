var Faker = require('faker');
var should = require('should');
var drafts = require('./../drafts');

it('creates a plan for a vanilla object that can be used as a draft', function(){
	drafts.plan(
		{
			post: {
				username: Faker.Name.findName()
			}
		});

	should.exist(drafts.vanilla.post);
	drafts.vanilla.post.username.should.be.a('string');
});

it('creates a plan for a standard object that can be used as a draft', function(){
	drafts.plan(
		{
			string: {
				name: Faker.Name.findName()			
			},
		});

	str = drafts.String();
	console.log(str);
	should.exist(str);
	should.exist(str.name)
});

// describe("Strategies ...", function(){
	// describe("setDefaultStrategy", function(){
	// 	it("default strategies are set and used to construct the object", function(){

	// 		var testStrategy = require('./strategies/test');
	// 		drafts.setDefaultStrategy(testStrategy);

	// 		drafts.plan(
	// 			{
	// 				string: {},
	// 			});
			
	// 		var str = drafts.String();
	// 		str.should.have.property("madeBy", "The Drafts Test Strategy(tm)");
	// 	});
	// });
// });