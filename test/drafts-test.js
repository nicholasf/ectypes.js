var drafts = require('./../drafts'),
	Sequelize = require('sequelize'),
	should = require('should'),
	Faker = require('faker');

var sequelize = new Sequelize('drafts_test', 'nicholas', null);

var draftsSequelize = require('./../drafts-sequelize').setup(sequelize);

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
		title: function(){ return Faker.Name.findName() },
		description: function(){ return Faker.Lorem.findSentences() }
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
});


	// it('can handle a simple one model plan', function(){
	// 	drafts.load(draftsSequelize);
	// 	drafts.plan(projectPlan);
	// 	project = drafts.Project.build();		
	// });


// vows.describe('strategies').addBatch({
// 	'calling drafts.plan with incorrect config':{
// 		topic: function(){ 
// 			try {
// 				drafts.plan({Project: {}}); 
// 			}
// 			catch(err){
// 				return err;
// 			}
// 		},
// 			'it returns err': function(topic){
// 				assert.instanceOf(topic, Error);
// 			},
// 		'calling with a simple one model plan':{
// 			topic: function(){
// 				drafts.load(draftsSequelize);
// 				drafts.plan(projectPlan);
// 				drafts.Project.build();		
// 			},
// 			'it can call build via the sequelize strategy': function(project){
// 				drafts.Project.build();
// 				assert.isNumber(project.id);
// 			},
// 			'the built object will have actual test data': function(project){

// 			},
// 		}			
// 	},
// }).export(module);
