Just include drafts-bb.js in your testing platform. Ensure that you also have Faker.js https://github.com/marak/Faker.js/

````
#example in coffee-script
drafts.plan
	Blog: 
		model: App.Models.Blog
		name: -> Faker.Name.findName()
	
blog = drafts.Blog();

blog.get('name'); #"Roslyn Anderson"
````

Note - if you want to set up a draft for more than one model, you currently have to repeat the structure (you can't currently embed more than one object in the initial setup):

````
#map two models in 2 separate calls to drafts.plan()
drafts.plan
	CfModule: 
		model: Portal.Models.CfModule
		name: -> Faker.Name.findName()
		urn:  -> Faker.Internet.domainWord()
		devices: []
		developers: []
		organisations: [] 

drafts.plan
	User:
		model: Portal.Models.User
		username: -> Faker.Internet.userName()
````

Properties can, of course, be overridden

````
#the above config applies

drafts.plan
	User:
		model: Portal.Models.User
		username: -> Faker.Internet.userName()

drafts.User({username: 'Frodo'});
````


This was meant to be a more ambitious testing factory library (strategies let you add different persistence layers - e.g. mongodb via mongoose, etc.). For now drafts can support backbone.js models (and soon collections).

I'll return to the rest of the library when time permits.
