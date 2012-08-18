//just a simple strategy for testing
var strategy = {};

strategy.setup = function(){
	return 'setup!';
};

exports.setup = strategy.setup;

exports.build = function(model, values){ 
	return values;
};

exports.ignores = ['setup', 'ignores'];
