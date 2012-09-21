var SimpleStrategy = function(){}

//a simple strategy for testing
SimpleStrategy.prototype.setup = function(){
	return 'setup!';
};

SimpleStrategy.prototype.build = function(model, values, cb){ 
	cb(null, values);
};

SimpleStrategy.prototype.create = function(model, values, cb){ 
	cb(null, values);
};

SimpleStrategy.prototype.ignores = ['setup', 'ignores'];

module.exports = SimpleStrategy;