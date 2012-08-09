var drafts = {};

drafts.VERSION = "0.0.1-alpha";
drafts.plans = [];	

drafts.setDefaultStrategy = function(strategy){
	drafts.defaultStrategy = strategy;
}

drafts._build = function(){
	this.plans.forEach(function(plan){			
		for (var mapping in plan){
			var strategy = null;

			if (mapping.strategy){
				strategy = mapping.strategy;
			}
			else if (drafts.defaultStrategy){
				strategy = drafts.defaultStrategy;
			}
			else { 
				//console.log("Missing strategy, assigning a simple stub.");
				strategy = {
					create: function(klassName, plan){
						klass = eval(klassName);
						// console.log(klassName, " <<<<<");
						return new klass();
					},
					save: function(obj){return obj;},
					resolve: function(drafts, obj, prop, value){ return true;},
					overrideProperty: function (obj, property, value){ obj[property] = value } 
				};
			}

			drafts[mapping] = function(){
				var obj = strategy.create(drafts, mapping, plan[mapping]);
				var overriddenProperties = [];

				for (var prop in plan[mapping]){
					//check for overriding args
					for (arg in arguments){
//						console.log("does arg (", arguments[arg], ") have a property ", prop, "? - ", arguments[arg][prop])
						if (arguments[arg][prop] !== undefined){
							obj = strategy.overrideProperty(obj, prop, arguments[arg][prop]);	
							overriddenProperties.push(prop);
						}
					}

					if (overriddenProperties.indexOf(prop) >= 0) {
						continue
					};

					//let the strategy resolve the property (for associations, etc..)
					var proceed = strategy.resolve(drafts, obj, prop, plan[mapping][prop]); 

					if (proceed){
						obj[prop] = plan[mapping][prop]();
					}
				}

				obj = strategy.save(obj);
				return obj;
			};

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

