# ectypes

A way to produce test objects quickly with any persistence layer.

## Meaning

ectype (plural ectypes)
(philosophy) A copy; usually contrasted with the original, or archetype.  

## Installation

```
npm install ectypes
```


## Explanation

Ectypes by itself is a DSL for buiding data types and specifying how they should be filled with data. 

Ectypes take descriptions of data types to build, usually in a test context.

```
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


### Writing Strategies

Ectpyes uses a strategy pattern to specify proxied calls to whichever underlying persistence layer(s) you might like to use - they're very simple to write. 

Current examples:

Current strategies - sequelize - http://www.sequelizejs.com/ . (Only build is supported, but that's enough to begin with).

If you write one, please let me know.

RUNNING TESTS

```
mocha tests/ectypes-test.js 
```
