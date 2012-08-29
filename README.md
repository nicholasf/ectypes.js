[![build status](https://secure.travis-ci.org/nicholasf/ectypes.js.png)](http://travis-ci.org/nicholasf/ectypes.js)

ectypes has been rewritten slightly. Strategies will continue to work, the only difference is a better formalization of concepts. You now set up a context (see the tests for now).

var ctx = require('ectypes').createContext();

A context takes blueprints.

A context takes a strategy.

A blueprint has keys and values.

A blueprint can be applied in a context to produce an ectype loaded with keys referencing invoked values.

context.producers();




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


## Explanation

Ectypes by itself is a DSL for building data types and specifying how they should be filled with data. 

Ectypes take descriptions of data types to build, usually in a test context.

```
var ectypes = require('ectypes');

ectypes.add({
	Project: {
		title: function(){ return Faker.Name.findName() }
	}
});
```

Ectypes need **strategies** to do things with the type.

```
ectypes.load(simpleStrategy);
```

Every function on the strategy (except for what is listed in an **ignores** array) is then mapped to the type, for example

```
project = ectypes.Project.build();
console.log(project.title); //gives 'Elaina Orn', a value produced by the Faker library.
```

In the above example, the simpleStrategy has defined a build(modelName, values) function, which ectypes will invoke, returning what it returns. 

Ectypes can also take **_hooks** to run on the produced object after a strategy's function has executed.

```
ectypes.add({
	Project: {
		title: function(){ return Faker.Name.findName() }
		, _hooks: ["after creation, add a task to the project", function(project, funcName){
			if (funcName === "create"){ 
			project.addTask(ectypes.Task.build()); 
		}
		}]
	}
	, Task {title: function(){ return Faker.Name.findName())
});
```


## Writing Strategies

Ectypes uses a strategy pattern to specify proxied calls to whichever underlying persistence layer(s) you might like to use - they're very simple to write. 


Current strategies:

ectypes-sequelize - http://github.com/nicholasf/ectypes-sequelize.js (for Sequelize - http://www.sequelizejs.com/).


If you write one, please let me know.

## Running Tests

```
mocha tests/ectypes-test.js 
```


## More Info

Ectypes originally worked for Backbone.js. So it is possible to enable this testing for browser based development. If anyone wants to discuss it, let me know.
