Drafts lets specify how your models should be populated with data. It utilizes a strategy pattern specify proxied calls to whichever underlying persistence layer(s) you might like to use - find a strategy for your persistence layer or write your own. They're very simple to write.

Current strategies - sequelize - http://www.sequelizejs.com/ . (Only build is supported, but that's enough to begin with).

Future strategies - mongodb (probaby mongolian).

See INFO.

Drafts is in alpha status. I plan to rename it and improve it over time, but it's functional for Sequelize.

INSTALLING

npm install drafts

RUNNING TESTS

mocha --ignore-leaks tests/drafts-test.js 

(There's a global leak coming from a dependency, can't help it).

INFO

For now, see test/drafts-test.js to gain an understanding.

Future plans - hooks, to help build associations.


Sequelize DSL:

You've created a model called Project that looks like:

var Project = sequelize.define('Project', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT
});

You want to be able to auto generate Project models with cool development or test data!

First, you set up the sequelize strategy with drafts.

```
var draftsSequelize = require('drafts-sequelize');
drafts.load(draftsSequelize);
```

Then you draft your data. The only rule is that the name of your draft matches the name of the model you declared in sequelize.

```
	drafts.plan(
		{
			Project: {
				title: function(){ return Faker.Name.findName() },
				description: function(){ return Faker.Lorem.findSentences() };
 			}
 		});

	project = drafts.Project.build();

```


In the future I'll be adding hooks, which will look something like the below (hopefully a cleaner language):

```
	drafts.plan(
		{
			Project: {
				title: function(){ return Faker.Name.findName() },
				description: function(){ return Faker.Lorem.findSentences() };
				_hooks: {
					build: {
						function(project, cb) {
							Task.create({});
							project.tasks = task;
							project.save().success(cb(project));
					}
				}
 		});

	project = drafts.Project.build();

```
