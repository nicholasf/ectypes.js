var ectypes = require('./../lib/ectypes')
	, Sequelize = require('sequelize')
	, should = require('should')
	, Faker = require('faker')
  , simpleStrategy = require('./simple-strategy');

var projectPlan = {
	Project: {
		title: function(){ return Faker.Name.findName() }
	}
};

describe('configuring strategies', function(){
	it('borks if you call ectypes.plan without setting a strategy', function(){
			try {
				ectypes.plan({Project: {}}); 
			}
			catch(err){
				should.exist(err);
			}
	});

	it('creates a proxy for planned foos', function(){
		ectypes.load(simpleStrategy);
		ectypes.add(projectPlan);
		should.exist(ectypes.Project);
	});

	it('maps the strategies to the planned foos', function(){
		ectypes.load(simpleStrategy);
		ectypes.add(projectPlan);
		should.exist(ectypes.Project.build);
	});

	it('constructs the planned foo', function(){
		ectypes.load(simpleStrategy);
		ectypes.add(projectPlan);
		var project = ectypes.Project.build();
		should.exist(project.title);
	});
});

var projectHookPlan = {
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
	ectypes.load(simpleStrategy);
	ectypes.add(projectHookPlan);
	var project = ectypes.Project.build();

	it('constructs the planned foo', function(){
		project.title.should.match(/hooked/);
	});

	it('passes in the function name used, so hooklogic can choose whether or not to do something', function(){
		project.title.should.match(/build/);
	});
});
