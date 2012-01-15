mill = require('./index')
Faker = require('faker')

mill.factory(
	"posts": {
		'username': Faker.Name.findName();
	}
})
