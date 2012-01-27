var Faker = require('faker');
var should = require('should');
var drafts = require('./../drafts');

describe('it creates a plan for a vanilla object that can be used as a draft', function(){
	drafts.plan(
		{
			post: {
				username: Faker.Name.findName()
			}
		});

	should.exist(drafts.vanilla.post);
	drafts.vanilla.post.username.should.be.a('string');
});

describe('it creates a plan for a vanilla object that can be used as a draft', function(){
	drafts.plan(
		{
			string: {}
		});

		should.exist(drafts.String);

	// console.log(">>>>>", String.draft());
	// should.exist(String.draft());
});

// describe('setting a default strategy', function(){
// 	var testStrategy = {msg: "test strategy"}
// 	drafts.defaultStrategy = testStrategy

// }

//test case planning
//pick an ORM and write to that
