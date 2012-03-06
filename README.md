#example
drafts.plan(
	Blog: {
		model: App.Models.Blog,
		name: -> Faker.Name.findName()
		urn:  -> Faker.Name.findName()
	} 
)

blog = drafts.Blog();

blog.get('name'); #"Roslyn Anderson"


This was meant to be a more ambitious testing factory library. For now drafts can support backbone.js models (and soon collections).

Just include drafts-bb.js in your testing platform. Ensure that you also have Faker.js https://github.com/marak/Faker.js/

I'll return to the rest of the library when time permits.
