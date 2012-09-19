var ectypes = {};

var package = require('./../package.json')
	, _ = require('underscore');

ectypes.VERSION = package.version;
ectypes.types = [];	
ectypes.producers = [];

ectypes.proxyProducerToStrategyFunctions = function(blueprint, chosenStrategy, strategyFunctionName, hooks){
  var transformedVals = {};

  var ectypeName =  _.keys(blueprint)[0];
	var blueprintObjects = blueprint[ectypeName];

  for (var key in blueprintObjects){
    if (key === "_hooks") {continue};
    transformedVals[key] = blueprintObjects[key]();
  }

  return function(){
    var obj = chosenStrategy[strategyFunctionName](ectypeName, transformedVals);

    for (var i in hooks){
    	console.log('setting up hooks');
      for(var hookfunc in hooks[i]) {
        if(typeof hooks[i][hookfunc] === 'function') {
          obj = hooks[i][hookfunc](obj, strategyFunctionName);
        }
      }
    }

    return obj;
  }
}


/* Takes a blueprint like:
**  {	Project: {
**		title: function(){ return Faker.Name.findName() }
** 	}
** }
** 
** and sets a producer on the context like
**
** context.Project 
**
** that can call any strategy function and pass it 
** blueprint values that have been transformed - e.g. a title string.
*/
ectypes.createProducer = function(context, blueprint){
	var chosenStrategy, producerName, producer;

	context.blueprintsCabinet.push(blueprint);

	if (blueprint._strategy){
		chosenStrategy = new blueprint.Strategy();
	}
	else {
		chosenStrategy = new context.Strategy();
	}
	
	if (!chosenStrategy){
		throw new Error("Ectypes - please set a default strategy on your context or an overriding _strategy in your blueprint.");
	}

	//ensure the producer object
	producerName = _.keys(blueprint)[0]; //improve this
	context[producerName] = {};
	producer = context[producerName]; //this is the producer, an object on the context

	var hooks = [];

	if (blueprint[producerName]._hooks){
		hooks = blueprint[producerName]._hooks;
	}

	for (var strategyFuncName in chosenStrategy) {
		var ignoring = _.include(chosenStrategy.ignores, strategyFuncName);

		if (!ignoring){
			var producerFunction = ectypes.proxyProducerToStrategyFunctions(blueprint, chosenStrategy, strategyFuncName, hooks);
			producer[strategyFuncName] = producerFunction;
		}
	}
}

ectypes.Context = function(){
	this.blueprintsCabinet = [];
	this.Strategy;

	this.load = function(Strategy){
		this.Strategy = Strategy;
	};

	//add blueprints to a context - they'll either arrive grouped in an array or alone
	this.add = function(blueprints){
		if (Object.prototype.toString.call(blueprints) === '[object Array]'){
			var _self = this;
			blueprints.forEach(function(blueprint){
				ectypes.createProducer(_self, blueprint);
				});
		}
		else {
			var blueprint = blueprints; //a singular blueprint
			ectypes.createProducer(this, blueprint); 
		}
	};
};

exports.createContext = function(){
	return new ectypes.Context();
};

exports.Context = ectypes.Context;
