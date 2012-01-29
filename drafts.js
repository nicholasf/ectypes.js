//method call after each addition to plans
//build plan objects

var drafts = {}

drafts.VERSION = "0.0.0";
drafts.plans = [];	
drafts.vanilla = {}

drafts._build = function(){
	this.plans.forEach(function(plan){			
			for (p in plan){
				var className = p.charAt(0).toUpperCase() + p.slice(1);
				var constant = global[className]

				if (constant === undefined){
					//if no match, then create a vanilla object
					drafts.vanilla[p] = plan[p];
				}
				else {
					var strategy = p.strategy;

					if ((strategy === undefined) && (drafts.defaultStrategy === undefined)){
						console.log("Missing strategy.");
						strategy = {
							save: function(){ console.log("Called save() on gapfill strategy")},
							resolve: function(){ console.log("Called resolve() on gapfill strategy")}
						};
					}

					//take each plan, scan each first level property in plan for a matching model
					//console.log("verified that ", className, "is a valid js object");
					//this constructor function should be wrapped by strategy functionality that obeys a common lifecycle
					//and that leverages the expressed plan

					//1. create the object via the strategy
					//2. fulfil the plan
					//2.1 each value of the plan should be passed to the strategy, which than work out how to fulfill it.
					exports[className] = function(){
						console.log("constructing the object! ", className);
						obj = new constant;
						console.log(">>", plan)
						for (prop in plan){
							proceed = strategy.resolve(obj, prop); //let the strategy resolve the property (for associations, etc..)
							if (proceed){
								obj[prop] = prop;
							}
						}

						strategy.save(obj)
						return obj;
					};
				}
			}
		}
	) 
}

drafts.plan = function (plannedObj){
	this.plans.push(plannedObj)
	this._build();
}

if(typeof exports != "undefined"){for (var prop in drafts){exports[prop] = drafts[prop];}}