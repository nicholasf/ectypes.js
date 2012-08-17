var drafts = require('./../lib/drafts'),
	Sequelize = require('sequelize'),
	should = require('should'),
	Faker = require('faker');

var sequelize = new Sequelize('drafts_test', 'nicholas', null);

var draftsSequelize = require('./../lib/strategies/sequelize').setup(sequelize);

var Project = sequelize.define('project', {
	id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
 	title: Sequelize.STRING,
  description: Sequelize.TEXT
});
 
var Task = sequelize.define('task', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
  project_id: { type: Sequelize.INTEGER, allowNull: false},
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  deadline: Sequelize.DATE
});

Project.hasMany(Task, { foreignKey: 'project_id' });

var projectPlan = {
	Project: {
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
});
