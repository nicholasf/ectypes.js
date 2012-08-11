var drafts = require('./../drafts'),
	Sequelize = require('sequelize'),
	vows = require('vows'),
	assert = require('assert'),
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

//sequelize.sync();

var projectPlan = {
	Project: {
		title: function(){ return Faker.Name.findName() },
		description: function(){ return Faker.Lorem.findSentences() }
	}
}

	// Task: {
	// 	title: function(){ return Faker.Name.findName() },		
	// }

vows.describe('strategies').addBatch({
	'calling drafts.plan with incorrect config':{
		topic: function(){ 
			try {
				drafts.plan({Project: {}}); 
			}
			catch(err){
				return err;
			}
		},
			'it returns err': function(topic){
				assert.instanceOf(topic, Error);
			}
	},
	'calling with a simple one model plan':{
		topic: function(){
			drafts.plan(projectPlan);
			drafts.Project.build();		
		},
		'it can call build via the sequelize strategy': function(project){
			assert.isNumber(project.id);
		},
		'the built object will have actual test data': function(project){

		},
	}
}).export(module);


// drafts.setStrategy = draftsSequelize;

// vows.describe('Creating a new Quote').addBatch({
// 	'HTTP GET for the quote form': {
// 		topic: function(){ 
// 			request('http://localhost:5000/leads', this.callback);
// 		},
// 		'Valid data posted returns HTTP status of 200': function(error, resp, body){
// 			assert.equal(resp.statusCode, 200);
// 		}
// 	}
// }).export(module);
