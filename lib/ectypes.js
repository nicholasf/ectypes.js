var ectypes = {};

var package = require('./../package.json')
	, _ = require('underscore')
  , async = require('async');

ectypes.VERSION = package.version;
ectypes.types = [];	
ectypes.producers = [];

// ectypes.proxyProducerToStrategyFunctions = function(blueprint, chosenStrategy, strategyFunctionName, cb){
//   var transformedVals = {};

//   var ectypeName =  _.keys(blueprint)[0];
//   var blueprintObjects = blueprint[ectypeName];
//   blueprintObjects.befores = (blueprintObjects.befores || [])

//   async.auto(blueprintObjects.befores, function(err, dependencyVals){
//     delete blueprintObjects.befores
//     for (var key in blueprintObjects){
//       transformedVals[key] = blueprintObjects[key]();
//     }

//     _.extend(transformedVals, dependencyVals);

//     var f = function(arg1, arg2){ 
//       console.log(arg1, arg2);

//       var cb2, overridingValues;

//       if (typeof arg1 === 'function'){
//         cb2 = arg1;
//       } 
//       else {
//         overridingValues = arg1;

//         for (var key in overridingValues){
//           transformedVals[key] = overridingValues[key];
//         }

//         cb2 = arg2;
//       }

//       chosenStrategy[strategyFunctionName](ectypeName, transformedVals, function(err, obj){
//         cb2(err, obj);
//       });
//     };
//     cb(null, f);
//   });
// }


ectypes.generateBlueprintData = function(blueprint, cb){
  var transformedVals = {};

  var ectypeName =  _.keys(blueprint)[0];
  var blueprintObjects = blueprint[ectypeName];
  blueprintObjects.befores = (blueprintObjects.befores || [])

  async.auto(blueprintObjects.befores, function(err, dependencyVals){
    delete blueprintObjects.befores

    for (var key in blueprintObjects){
      transformedVals[key] = blueprintObjects[key]();
    }
    _.extend(transformedVals, dependencyVals);
    cb(null, transformedVals);
  })
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

  var ignores = chosenStrategy.ignores;
  var keys = _.keys(chosenStrategy);

  var strategyFuncNames = [];
  for (var strategyFuncName in chosenStrategy) {
    if (!_.contains(chosenStrategy.ignores, strategyFuncName)){
      strategyFuncNames.push(strategyFuncName);      
    }
  }

  // chosenStrategy[strategyFunctionName](ectypeName, transformedVals, function(err, obj){
  //   cb2(err, obj);
  // });

  var f1 = function(strategyFuncName, cb){
    context[producerName][strategyFuncName] = function(arg1, arg2){
      var cb2, overridingValues;

      if (typeof arg1 === 'function'){
        cb2 = arg1;
      } 
      else {
        overridingValues = arg1;
        cb2 = arg2;
      }

      ectypes.generateBlueprintData(blueprint, function(err, data){
        console.log("raw data - from blueprint", data);
        // console.log(arg1, "<<<< ", strategyFuncName, data)
        for (var key in overridingValues){
          data[key] = overridingValues[key];
        }

        chosenStrategy[strategyFuncName](producerName, data, function(err, obj){
          cb2(err, obj);
        });
      });
    }
    cb();
  };

  async.forEach(strategyFuncNames, f1)

  // for (var i in strategyFuncs) {
  //   var strategyFuncName = strategyFuncs[i];

  //   context[producerName][strategyFuncName] = function(arg1, arg2){

  //     console.log('calling ', strategyFuncName);
  //     ectypes.proxyProducerToStrategyFunctions(blueprint, chosenStrategy, strategyFuncName, function(err, f){
  //       f.call(arg1, arg2);
  //     });
  //   }
  // }  
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
