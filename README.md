Currently in proof of concept development, come back later please.

Drafts.js: an object generator with fake data (uses Faker.js). Define a set of Drafts for your model layer and have them populated with fake data.

draft [drɑːft] n 1. a plan, sketch, or drawing of something

Drafts.js is able to integrate with any ORM system via strategies (see below). This allows for a clean DSL when setting up test data in your models.

Foo.draft({...}) for Models
----------------------
Simply call draft({...}) on the model. Any variables or functions in the argument to draft({...}) will be setup on the draft returned (and will override default values).


	//factory call to generate a model instance, created
	comment = Comment.draft();
	should.exist comment.id


	//factory call to generate a model instance, unsaved
	comment = Comment.sketch();
	should.not.exist comment.id

drafts.foo() for Vanilla Objects
--------------------------------
Currently debating whether to name them 'vanilla objects' but the idea is accurate.
In case you don't want to use specific model classes you can set up a plan for any sort of object you might want to construct.


	//factory call to generate vanilla obj (no ORM)
	foo = drafts.vanilla.foo();


Draft Plans
-----------
Drafts are defined with plans. Plans simply explain the type of data the properties and functions of a model possess. 

For now just include these in a file in your tests that is required before a test run.


//an example strategy for Mongoose

drafts = require("drafts")
drafts.defaultStrategy = //an ORM strategy (see below)


	drafts.plan(
		{
			Post: {
				topic: Faker.Lorem.words(),
				comments: drafts.strategy(Comments) //this function is supplied by a strategy (see below)
			}
		});

	drafts.plan(
		{
			Comment: {
				username: Faker.Name.findName(),
				text: Faker.Lorem.sentences()
			}
		});


Future ideas - a drafts.plans() function that takes an array of plans.


Drafts Strategies and ORMS
--------------------------

Strategies integrate an ORM into Drafts.

Stratgies are responsible for 3 things:

1) Handling the database connection.

Fairly obvious. 

2) Telling Drafts which ORM on the function to call when saving in the database, e.g. Comment.draft() needs to know how to create and save a Comment in the db.

...


3) Defining further ORM specific functions that can be used in Drafts plans, for e.g. associations between models (and plans)

Drafts will scan the strategy for variables that reference functions. If that variable name is used in the draft plan, then Drafts will call the strategy's function by the same name.

An example strategy:


	{
		hasMany: function(plan){
			//we create 50 of plan and build the association here
		},
		save: model.save()
	}


Default Strategies.
You can specify a default strategy, and this can be overridden in each plan by specifying an alternate strategy.


