//sequelize strategy

var strategy = {};

strategy.setup = function(sequelize){
	strategy.sequelize = sequelize;
};

exports.setup = strategy.setup;