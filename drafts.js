//method call after each addition to plans
//build plan objects

var drafts = {}

drafts.VERSION = "0.0.0";
drafts.plans = [];	
drafts.vanilla = {}

drafts.setDefaultStrategy = function(strategy){
	this.defaultStrategy = strategy;
}

drafts._build = function(){
	this.plans.forEach(function(plan){			
			for (var p in plan){
				var key = p
				var className = p.charAt(0).toUpperCase() + p.slice(1);
				var constant = global[className]

console.log(">>", className, constant)


				if (constant === undefined){
					//if no match, then create a vanilla object
					drafts.vanilla[p] = plan[p];
				}
				else {
					var strategy = null;
					console.log("Default strategy: ", drafts.defaultStrategy);

					if (p.strategy){
						strategy = p.strategy;
					}
					else if (drafts.defaultStrategy){
						strategy = drafts.defaultStrategy;
					}
					else {	
						console.log("Missing strategy, assigning a simple stub.");

						strategy = {
							save: function(obj){},
							resolve: function(obj, prop){ return true;}
						};
					}

					exports[className] = function(){
						var obj = new constant;

						if (strategy){						
							for (var prop in plan[key]){
								var proceed = strategy.resolve(obj, prop); //let the strategy resolve the property (for associations, etc..)
								if (proceed){
									obj[prop] = prop;
								}
							}

							strategy.save(obj)
						}

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