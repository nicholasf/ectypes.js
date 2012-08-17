var lingo = require('lingo');

//sequelize strategy
var strategy = {};

strategy.setup = function(sequelize){
	strategy.sequelize = sequelize;
	return this;
};

exports.setup = strategy.setup;

exports.build = function(model, values){ 
	var tableName = model.toLowerCase();
	tableName = lingo.en.pluralize(tableName);
	tableName = lingo.underscore(tableName);
	var dao = strategy.sequelize.daoFactoryManager.getDAO(tableName);

	if (!dao){
		throw Error("Could not locate Sequelize DAO for " + tableName);
	}
	
	var modelInstance = dao.build(values);
	return modelInstance;
};

exports.ignores = ['setup', 'ignores'];
