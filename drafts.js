var drafts = {};
var package = require('./package.json');


drafts.VERSION = package.version;
drafts.plans = [];	

drafts.setStrategy = function(strategy){
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
				chosenStrategy = drafts.strategy;
			}
			else { 
				//console.log("Missing strategy, assigning a simple stub.");
				throw new Error("Drafts - please set a strategy");
			}

			//this has to 
			//drafts.Project.build
			//this needs to be a call to the strategy, to resolve the invocation,
			//and, it should also pass in the data generated from running the plan
			drafts[mapping] = function(){	

			}


// 				var obj = strategy.create(drafts, mapping, plan[mapping]);
// 				var overriddenProperties = [];

// 				for (var prop in plan[mapping]){
// 					//check for overriding args
// 					for (arg in arguments){
// //						console.log("does arg (", arguments[arg], ") have a property ", prop, "? - ", arguments[arg][prop])
// 						if (arguments[arg][prop] !== undefined){
// 							obj = strategy.overrideProperty(obj, prop, arguments[arg][prop]);	
// 							overriddenProperties.push(prop);
// 						}
// 					}

// 					if (overriddenProperties.indexOf(prop) >= 0) {
// 						continue
// 					};

// 					//let the strategy resolve the property (for associations, etc..)
// 					var proceed = strategy.resolve(drafts, obj, prop, plan[mapping][prop]); 

// 					if (proceed){
// 						obj[prop] = plan[mapping][prop]();
// 					}
// 				}

// 				obj = strategy.save(obj);
// 				return obj;
// 			};

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

