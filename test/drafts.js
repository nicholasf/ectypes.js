var Faker = require('faker');
var should = require('should');
var drafts = require('./../drafts');

console.log(drafts);

describe( 'it creates a plan for a vanilla object that can be used as a draft', function(){
	drafts.plan(
		{
			post: {
				username: Faker.Name.findName()
			}
		});

	should.exist(drafts.post);
	drafts.post.username.should.be.a('string');
});


//test case planning

//desrcribe vanilla object generation

//pick an ORM and write to that
