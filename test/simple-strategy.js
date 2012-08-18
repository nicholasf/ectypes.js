//a simple strategy for testing
exports.setup = function(){
	return 'setup!';
};

exports.build = function(model, values){ 
	console.log('build');
	return values;
};

exports.create = function(model, values){ 
	console.log('create');
	return values;
};

exports.ignores = ['setup', 'ignores'];