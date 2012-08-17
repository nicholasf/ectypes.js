//sequelize strategy
var strategy = {};

strategy.setup = function(sequelize){
	strategy.sequelize = sequelize;
	return this;
};

exports.setup = strategy.setup;

exports.build = function(model, values){ 
	var dao = strategy.sequelize.daoFactoryManager.getDAO(model.toLowerCase());
	var modelInstance = dao.build(values);
	console.log(modelInstance);
	return modelInstance;
};

exports.ignores = ['setup', 'ignores'];