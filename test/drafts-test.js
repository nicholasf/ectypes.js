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

vows.describe('strategies').addBatch({
	'calling drafts.plan':{
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
