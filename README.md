 [![build status](https://secure.travis-ci.org/nicholasf/ectypes.js.png)](http://travis-ci.org/nicholasf/ectypes.js)

# ectypes
A way to produce test objects quickly with any persistence layer.

### The Name

ectype (plural ectypes)
(philosophy) A copy; usually contrasted with the original, or archetype.  

As opposed to prototype, ectype originally meant “wrought in relief” in Greek. Its roots are ec, a variant of “ex,” and týpos, a “figure on a wall.”

## Installation

```
npm install ectypes
```

## Explanation: Contexts, Strategies, Blueprints and Producers.

Ectypes is a DSL for building persistable data types and describing how they should be filled with data. If you've ever used factory_girl or machinist (Ruby testing libraries) the concept will be familiar to you.

Ectypes uses a *strategy* to identify how to talk to whichever persistence layer you've chosen to use (mongodb, relational db, redis, whatever).

```
var ectypes = require('ectypes')
  , ctx = ectypes.createContext()
  , SimpleStrategy = require('./simple-strategy');

ctx.load(new SimpleStrategy());

```

Ectype *contexts* take *blueprints* of data types, and make them available.

```
var projectBlueprint = {
	Project: {
		title: function(){ return Faker.Name.findName() }
	}
};

ctx.add(projectBlueprint);
```

This blueprint could have held any amount of object descriptions.

Every function on the strategy (except for what is listed in an **ignores** array) is then mapped to the type, as a *producer*.

```
ctx.Project.build(function(err, project){ 
  console.log(project.title); //gives 'Elaina Orn', a value produced by the Faker library.
});

```

In the above example, the simpleStrategy has defined a function named 'build' accepting the arguments '(modelName, values, callback)'. Ectypes builds a *producer* function mapping to the *strategy's* function and passing it the appropriate data.

If you wanted to override the value of some test data in some circumstances (to set up relations to other objects, etc.):

```
ctx.Project.build({title: 'Someone else'}, function(err, project){ 
  console.log(project.title); //gives 'Someone else'
});
```

In the above, if the first argument to a strategy call is an object, any values it contains will be used to override the generated ones. If it's a function then it's assumed to be the conventional Node.js callback function(err, result).

It is up to you, when writing the strategy, which behaviours you want to support.

## Writing Strategies

Ectypes uses a strategy pattern to specify proxied calls to whichever underlying persistence layer(s) you might like to use - they're very simple to write. 


Current strategies:

* ectypes-postgres - https://github.com/nicholasf/ectypes-postgres.js . A barebones way of inserting test data into postgres.

* ectypes-sequelize - http://github.com/nicholasf/ectypes-sequelize.js (for Sequelize - http://www.sequelizejs.com/). - This is only compatible with 0.0.5 and earlier versions of ectypes.


If you write one, please let me know.

## Running Tests

```
npm test 
```


## More Info

Ectypes originally worked for Backbone.js. So it is possible to enable this testing for browser based development. If anyone wants to discuss it, let me know.
