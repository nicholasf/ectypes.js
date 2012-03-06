var drafts = {}

drafts.VERSION = "0.0.1-alpha";
drafts.plans = [];	

drafts.setDefaultStrategy = function(strategy){
	drafts.defaultStrategy = strategy;
}

drafts._build = function(){
	this.plans.forEach(function(plan){			
			for (var p in plan){
				var className = p;
				var constant = global[className];

				if (constant === undefined && drafts.defaultStrategy == null){
					//if no match, then create a vanilla constructor
					drafts[p] = plan[p];
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
							create: function(klass, plan){return new klass();},
							save: function(obj){return obj;},
							resolve: function(drafts, obj, prop, value){ return true;}
						};
					}

					drafts[className] = function(){
						var obj = strategy.create(className, plan[className]);

						for (var prop in plan[className]){
							//let the strategy resolve the property (for associations, etc..)
							var proceed = strategy.resolve(drafts, obj, prop, plan[className][prop]); 

							if (proceed){
								obj[prop] = plan[className][prop]();
							}
						}

						obj = strategy.save(obj);
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

//copy of the bb strategy
bbStrategy = {}

bbStrategy.setCollectionCount = function(num){
	this.collectionCount = num;
}

bbStrategy.create = function(key, properties){
	return new properties['model']({});
}

bbStrategy.save = function(obj){
	if (typeof $ === 'undefined' && !syncOverridden) {
		console.log("$ is not defined. Overriding Backbone.sync to do nothing but log calls.");
		Backbone.sync = function(method, model, options) { 
			console.log("Backbone.sync(" + method + ", " + model + ", " + options +" )");
		};
	}
	obj.save();
	return obj;
}

bbStrategy.resolve = function(drafts, obj, property, propertyValue){
	if (property == 'model'){ return false };

	if (propertyValue instanceof Function){
		var val = propertyValue();
	}
	else{
		val = propertyValue;
	}
console.log(obj);
console.log('thought so ...');

	obj.set(property, val);
	return false;
}


drafts.setDefaultStrategy(bbStrategy)
