//method call after each addition to plans
//build plan objects

var drafts = {}

drafts.VERSION = "0.0.0";
drafts.plans = [];	
drafts.vanilla = {}

drafts.setDefaultStrategy = function(strategy){
	drafts.defaultStrategy = strategy;
}

drafts._build = function(){
	this.plans.forEach(function(plan){			
			for (var p in plan){
				var key = p
				var className = p.charAt(0).toUpperCase() + p.slice(1);
				var constant = global[className]

				if (constant === undefined){
					//if no match, then create a vanilla object
					drafts.vanilla[p] = plan[p];
				}
				else {
					var strategy = null;

					if (p.strategy){
						strategy = p.strategy;
					}
					else if (drafts.defaultStrategy){
						strategy = drafts.defaultStrategy;
					}
					else {
						console.log("Missing strategy, assigning a simple stub.");

						strategy = {
							create: function(klass){return new klass();},
							save: function(obj){return obj;},
							resolve: function(obj, prop){ return true;}
						};
					}

					exports[className] = function(){
						var obj = strategy.create(constant)

						if (strategy){						
							for (var prop in plan[key]){
								//let the strategy resolve the property (for associations, etc..)
								var proceed = strategy.resolve(obj, prop); 
								if (proceed){
									obj[prop] = plan[key][prop]();
								}
							}

							obj = strategy.save(obj);
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