var ectypes = {};

var package = require('./../package.json')
	, _ = require('underscore');

ectypes.VERSION = package.version;
ectypes.types = [];	

ectypes.load = function(strategy){
	ectypes.strategy = strategy;
};

ectypes._build = function(){
	this.types.forEach(function(plan){	

		for (var mapping in plan){
			var strategy = null;

			if (mapping._strategy){
				strategy = mapping.strategy;
			}
			else if (!ectypes.strategy){
				throw new Error("Ectypes - please set a strategy");
			}

			if (!ectypes[mapping]){
				ectypes[mapping] = {};
			}

			var hooks = [];

			if (plan[mapping]._hooks){
				hooks = plan[mapping]._hooks;
			}

			for (var prop in ectypes.strategy) {
				var ignoring = _.include(ectypes.strategy.ignores, prop);

				if (!ignoring){
					ectypes[mapping][prop] =  ectypes.createProxy(mapping, plan[mapping], prop, hooks)
				}
			}

			exports[mapping] = ectypes[mapping]; //remove this in browser build
		}
	}) 
};

ectypes.add = function (plannedObj){
	ectypes.types.push(plannedObj);
	ectypes._build();
};

ectypes.createProxy = function(typeName, mapping, strategyFunctionName, hooks){
  var transformedVals = {};

  for (var val in mapping){
    if (val === "_hooks") {continue};
    transformedVals[val] = mapping[val]();
  }

  return function(){
    var obj = ectypes.strategy[strategyFunctionName](typeName, transformedVals);

    for (var i in hooks){
      for(var hookProp in hooks[i]) {
        if(typeof hooks[i][hookProp] === 'function') {
          obj = hooks[i][hookProp](obj, strategyFunctionName);
        }
      }
    }

    return obj;
  }
}

exports.add = ectypes.add;
exports.load = ectypes.load;


