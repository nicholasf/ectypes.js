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

			ectypes[mapping] = {};

			var hooks = [];
			if (plan[mapping]._hooks){
				hooks = plan[mapping]._hooks;
			}

			for (var prop in ectypes.strategy) {
				var ignoring = _.include(ectypes.strategy.ignores, prop);

				if (!ignoring){
					var fastenProp = prop;

					ectypes[mapping][prop] = function(){
						var transformedVals = {};

						for (var val in plan[mapping]){
							if (val === "_hooks") {continue};
							transformedVals[val] = plan[mapping][val]();
						}

						var obj = ectypes.strategy[fastenProp](mapping, transformedVals);

						for (var i in hooks){
							for(var hookProp in hooks[i]) {
						    if(typeof hooks[i][hookProp] === 'function') {
						    	obj = hooks[i][hookProp](obj, fastenProp);
							  }
							}
						}

						return obj;
					}
				}
			}

			exports[mapping] = ectypes[mapping]; //remove this in browser build
		}
	}) 
};

ectypes.add = function (plannedObj){
	this.types.push(plannedObj);
	this._build();
};
//@BROWSER-ends

//export as a module
for (var prop in ectypes){exports[prop] = ectypes[prop];}

