var should = require('should');
drafts = require('./drafts')

describe( 'it creates a plan that can be used as a draft', function(){
	drafts.plan(
		{
			post: {
				username: Faker.Name.findName()
			}
		});

	should.exist(drafts.post)
});

