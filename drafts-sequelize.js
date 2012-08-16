//sequelize strategy
var strategy = {};

strategy.setup = function(sequelize){
	strategy.sequelize = sequelize;
	return this;
};

exports.setup = strategy.setup;
exports.build = function(){ console.log('wow!') };

exports.ignores = ['setup'];