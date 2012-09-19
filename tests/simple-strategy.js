var SimpleStrategy = function(){}

//a simple strategy for testing
SimpleStrategy.prototype.setup = function(){
	return 'setup!';
};

SimpleStrategy.prototype.build = function(model, values){ 
	return values;
};

SimpleStrategy.prototype.create = function(model, values){ 
	return values;
};

SimpleStrategy.prototype.ignores = ['setup', 'ignores'];

module.exports = SimpleStrategy;