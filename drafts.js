var drafts = {};
var package = require('./package.json')
	, _ = require('underscore');


drafts.VERSION = package.version;
drafts.plans = [];	

drafts.load = function(strategy){
	drafts.strategy = strategy;
}

drafts._build = function(){
	this.plans.forEach(function(plan){	

		for (var mapping in plan){
			var strategy = null;

			//checks for _strategy on a per plan basis to override the default
			if (mapping._strategy){
				strategy = mapping.strategy;
			}
			else if (drafts.strategy){
				var chosenStrategy = drafts.strategy;
			}
			else { 
				throw new Error("Drafts - please set a strategy");
			}

			drafts[mapping] = {};

			for (var prop in drafts.strategy) {
				var ignoreIt = _.find(drafts.strategy.ignores, function(funcName){
					return prop === funcName;
				})

				if (!ignoreIt){
					drafts[mapping][prop] = drafts.strategy[prop];
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

