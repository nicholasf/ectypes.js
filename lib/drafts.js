var drafts = {};
var package = require('./../package.json')
	, _ = require('underscore')
	, draftsSequelize = require('./strategies/sequelize'); //remove later

drafts.VERSION = package.version;
drafts.plans = [];	

drafts.load = function(strategy){
	drafts.strategy = strategy;
}

drafts._build = function(){
	this.plans.forEach(function(plan){	

		for (var mapping in plan){
			var strategy = null;

			if (mapping._strategy){
				strategy = mapping.strategy;
			}
			else if (!drafts.strategy){
				throw new Error("Drafts - please set a strategy");
			}

			drafts[mapping] = {};

			var transformedVals = {};
			for (var val in plan[mapping]){
				transformedVals[val] = plan[mapping][val]();
			}

			for (var prop in drafts.strategy) {
				var ignoring = _.include(drafts.strategy.ignores, prop);

				if (!ignoring){
					var fastenProp = prop;
					drafts[mapping][prop] = function(){
						return drafts.strategy[fastenProp](mapping, transformedVals);
					}
				}
			}

			exports[mapping] = drafts[mapping]; //remove this in browser build
		}
	}) 
}

drafts.plan = function (plannedObj){
	this.plans.push(plannedObj);
	this._build();
}
//@BROWSER-ends

//export as a module
for (var prop in drafts){exports[prop] = drafts[prop];}

exports.sequelize = function(sequelize){
	draftsSequelize.setup(sequelize);
	drafts.load(draftsSequelize);
}
