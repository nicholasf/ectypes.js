//a simple strategy for testing
exports.setup = function(){
	return 'setup!';
};

exports.build = function(model, values){ 
	return values;
};

exports.create = function(model, values){ 
	return values;
};

exports.ignores = ['setup', 'ignores'];