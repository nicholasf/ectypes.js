
Drafts lets you define ways to build data structures and fill them with information. 

Usually this is helpful when building information for tests or development.

Create a clean DSL for testing that can utilize the best aspects of different persistence layers (sequelize, mongoose, node-orm etc. etc.)


Sequelize DSL:

You've created a model called Project that looks like:

var Project = sequelize.define('Project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
});

You want to be able to auto generate Project models with cool development or test data!

First, you set up the sequelize strategy with drafts.

```
var draftsSequelize = require ('drafts-sequelize');
drafts.setStrategy(draftsSequelize);
```

Then you draft your data. The only rule is that the name of your draft matches the name of the model you declared in sequelize.

```
	drafts.plan(
		{
			Project: {
				title: function(){ return Faker.Name.findName() },
				description: function(){ return Faker.Lorem.findSentences() };
				hooks: {
					build: {
						function(project, cb) {
							Task.create({});
							project.tasks = task;
							project.save().success(cb(project));
					}
				}
 			}
 		});

	project = ø.Project.build();

```

So, I redefine strategies to express the DSL of the underlying persistence mechanism (however the strategy writer wants), but override properties to generate the test data. 


Hooks: 
take the name of a function in the strategy and are called after it, in the order of appearance.



For sequelize the strategy will define:
- build
- overrideProperty

associations - either hasOne, hasMany, or belongsTo




later
- create?
- associations

need to consider how to handle associations. 

Then everything else is handled by the real sequelize model itself.








## The below is old. Ignore for the timebeing

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
