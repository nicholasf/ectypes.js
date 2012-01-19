draft = require('./drafts')
Faker = require('faker')

draft.plan(
	{
		post: {
			username: Faker.Name.findName()
		}
	})

draft.post({password: "123"})
