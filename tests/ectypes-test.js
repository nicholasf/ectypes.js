var ctx = require('./../lib/ectypes').createContext()
	, should = require('should')
	, Faker = require('Faker')
  , simpleStrategy = require('./simple-strategy');

var projectBlueprint = {
	Project: {
		title: function(){ return Faker.Name.findName() }
	}
};

var multiBlueprint = [
	{Person: {
		title: function(){ return Faker.Name.findName() }
	}}
	, {Ancestor: {
		title: function(){ return Faker.Name.findName() }
	}}
];

describe('configuring strategies', function(){
	it('borks if you call ctx.add without setting a strategy', function(){
			try {
				ctx.add({Project: {}}); 
			}
			catch(err){
				err.toString().should.equal('Error: Ectypes - please set a default strategy on your context or an overriding _strategy in your blueprint.');
				should.exist(err);
			}
	});
});

describe('creating producers from blueprints', function(){

	it('creates a producer for a single blueprinted Project', function(){
		ctx.load(simpleStrategy);
		ctx.add(projectBlueprint);
		should.exist(ctx.Project);
	}); 

	it('creates producers for an array of blueprints', function(){
		ctx.load(simpleStrategy);
		ctx.add(multiBlueprint);
		should.exist(ctx.Person);
		should.exist(ctx.Ancestor);
	});

	it('maps the strategies functions onto the producer', function(){
		ctx.load(simpleStrategy);
		ctx.add(projectBlueprint);
		should.exist(ctx.Project.build);
	});

	it('the build function on simpleStrategy called from the producer works', function(){
		ctx.load(simpleStrategy);
		ctx.add(projectBlueprint);
		var project = ctx.Project.build();
		should.exist(project.title);
	});
});

var projectHookBlueprint = {
	Project: {
		title: function(){ return Faker.Name.findName() }
		, _hooks: [{
			'concats _hooked onto the project title': function(project, functionName){
				project.title = project.title + "_hooked_" + functionName;
				return project;
			}
		}]
	}
}

describe('hooks', function(){
	ctx.load(simpleStrategy);
	ctx.add(projectHookBlueprint);
	var project = ctx.Project.build();

	it('constructs the planned foo', function(){
		project.title.should.match(/hooked/);
	});

	it('passes in the function name used, so hooklogic can choose whether or not to do something', function(){
		project.title.should.match(/build/);
	});
});
