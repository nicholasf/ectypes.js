var ectypes = {};

var package = require('./../package.json')
	, _ = require('underscore');

ectypes.VERSION = package.version;
ectypes.types = [];	
ectypes.producers = [];

ectypes.proxyProducerToStrategyFunctions = function(blueprint, chosenStrategy, strategyFunctionName){
  var transformedVals = {};

  var ectypeName =  _.keys(blueprint)[0];
	var blueprintObjects = blueprint[ectypeName];
  var dependencyVals = {};

  if (blueprintObjects.dependency){
    dependencyVals = blueprintObjects.dependency();
    delete blueprintObjects.dependency;
  }

  for (var key in blueprintObjects){
    transformedVals[key] = blueprintObjects[key]();
  }

  _.extend(transformedVals, dependencyVals);

  return function(arg1, arg2){ 
  	var cb, overridingValues;

  	if (typeof arg1 === 'function'){
  		cb = arg1;
  	} else {
  		overridingValues = arg1;

  		for (var key in overridingValues){
				transformedVals[key] = overridingValues[key];
  		}

  		cb = arg2;
  	}

    console.log(" - - ", strategyFunctionName);
    chosenStrategy[strategyFunctionName](ectypeName, transformedVals, function(err, obj){
      cb(err, obj);
    });
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
		chosenStrategy = blueprint._strategy;
	}
	else {
		chosenStrategy = context.strategy;
	}
	
	if (!chosenStrategy){
		throw new Error("Ectypes - please set a default strategy on your context or an overriding _strategy in your blueprint.");
	}

	producerName = _.keys(blueprint)[0]; 
	context[producerName] = {};

	for (var strategyFuncName in chosenStrategy) {
    proceed = _.contains(chosenStrategy.ignores, strategyFuncName);

    if (proceed) continue;
    else{
      context[producerName][strategyFuncName] = function(){
        var args = arguments;
        return function(){
          var func = ectypes.proxyProducerToStrategyFunctions(blueprint, chosenStrategy, strategyFuncName);
          func.call(args);
        }
      }
    }
	}
}

ectypes.Context = function(){
	this.blueprintsCabinet = [];
	this.strategy;

	this.load = function(strategy){
		this.strategy = strategy;
	};

	//add blueprints to a context - they'll either arrive grouped in an array or alone
	this.add = function(blueprints){
		if (Object.prototype.toString.call(blueprints) === '[object Array]'){
			var self = this;
			blueprints.forEach(function(blueprint){
				ectypes.createProducer(self, blueprint);
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
