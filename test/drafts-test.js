var drafts = require('./../lib/drafts'),
	Sequelize = require('sequelize'),
	should = require('should'),
	Faker = require('faker');

var sequelize = new Sequelize('drafts_test', 'nicholas', null);

var draftsSequelize = require('./../lib/strategies/sequelize').setup(sequelize);

var Project = sequelize.define('projects', {
	id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
 	title: Sequelize.STRING,
  description: Sequelize.TEXT
});
 
//a var and table name with more complex pluralization and underscoring requirements
var SimpleRequest = sequelize.define('simple_requests', {
	id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
 	title: Sequelize.STRING,
});

var projectPlan = {
	Project: {
		title: function(){ return Faker.Name.findName() }
	}
}

var requestPlan = {
	SimpleRequest: {
		title: function(){ return Faker.Name.findName() }		
	}
}

describe('strategies', function(){
	it('borks if you call drafts.plan without setting a strategy', function(){
			try {
				drafts.plan({Project: {}}); 
			}
			catch(err){
				should.exist(err);
			}
	});

	it('creates a proxy for planned foos', function(){
		drafts.load(draftsSequelize);
		drafts.plan(projectPlan);
		should.exist(drafts.Project);
	});

	it('maps the strategies to the planned foos', function(){
		drafts.load(draftsSequelize);
		drafts.plan(projectPlan);
		should.exist(drafts.Project.build);
	});

	it('constructs the planned foo', function(){
		drafts.load(draftsSequelize);
		drafts.plan(projectPlan);
		var project = drafts.Project.build();
		should.exist(project.title);
	});

	it('constructs the planned foo (with two names for pluralization and underscoring)', function(){
		drafts.load(draftsSequelize);
		drafts.plan(requestPlan);
		var request = drafts.SimpleRequest.build();
		should.exist(request.title);
	});

	it('throws an error if it cannot locate the corresponding sequelize dao', function(){
		drafts.load(draftsSequelize);
		drafts.plan({Fail:{}});

		try{
			drafts.Fail.build();
		}
		catch(err){
			should.exist(err);
		}
	})
});

var projectHookPlan = {
	Project: {
		title: function(){ return Faker.Name.findName() }
		, _hooks: [{
			'concats _hooked onto the project title': function(project, functionName){
				console.log(" CALLED! ");
				project.title = project.title + "_hooked_" + functionName;
				return project;
			}
		}]
	}
}


describe('hooks', function(){
	drafts.load(draftsSequelize);
	drafts.plan(projectHookPlan);
	var project = drafts.Project.build();
	var project3 = drafts.Project.build();

	it('constructs the planned foo', function(){
		project.title.should.match(/hooked/);
		console.log(project.title);
	});

	it('passes in the function name used, so logic can choose whether or not to hook', function(){
		project.title.should.match(/build/);
		console.log(project.title, "< 1");
		var project2 = drafts.Project.build();
		console.log(project2.title, "< 2");
		console.log(project3.title, "< 3");
		project2.title.should.match(/build/);
	});

});
