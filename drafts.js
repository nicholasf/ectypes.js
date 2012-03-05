//method call after each addition to plans
//build plan objects

var drafts = {}

drafts.VERSION = "0.0.1-alpha";
drafts.plans = [];	
//drafts.vanilla = {}

drafts.setDefaultStrategy = function(strategy){
	drafts.defaultStrategy = strategy;
}

drafts._build = function(){
	this.plans.forEach(function(plan){			
			for (var p in plan){
				var className = p;
				var constant = global[className];

				if (constant === undefined){
					console.log('ok', plan[p]);
					//if no match, then create a vanilla constructor
					drafts[p] = plan[p];
					console.log(">>>", drafts);
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
						//console.log("Missing strategy, assigning a simple stub.");

						strategy = {
							create: function(klass){return new klass();},
							save: function(obj){return obj;},
							resolve: function(drafts, obj, prop, value){ return true;}
						};
					}

					exports[className] = function(){
						var obj = strategy.create(constant)

						for (var prop in plan[className]){
							//let the strategy resolve the property (for associations, etc..)
							var proceed = strategy.resolve(drafts, obj, prop, plan[className][prop]); 

							if (proceed){
								obj[prop] = plan[className][prop]();
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

for (var prop in drafts){exports[prop] = drafts[prop];}

