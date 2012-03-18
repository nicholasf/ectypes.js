//built on 2012-03-18 13:26:20 +1100

var drafts = {};

drafts.VERSION = "0.0.1-alpha";
drafts.plans = [];	

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
					create: function(klass, plan){return new klass();},
					save: function(obj){return obj;},
					resolve: function(drafts, obj, prop, value){ return true;},
					overrideProperty: function (obj, property, value){ obj[property] = value } 
				};
			}

			drafts[mapping] = function(){
				var obj = strategy.create(mapping, plan[mapping]);
				var overriddenProperties = [];

				for (var prop in plan[mapping]){
					//check for overriding args
					for (arg in arguments){
//						console.log("does arg (", arguments[arg], ") have a property ", prop, "? - ", arguments[arg][prop])
						if (arguments[arg][prop] !== undefined){
							obj = strategy.overrideProperty(obj, prop, arguments[arg][prop]);	
							console.log(obj.get(prop))				
							console.log('property overridden', obj);	
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
		}
	}
	) 
}

drafts.plan = function (plannedObj){
	this.plans.push(plannedObj);
	this._build();
}

//@
var syncOverridden = false;

exports.setCollectionCount = function(num){
	this.collectionCount = num;
}

exports.create = function(key, properties){
	return new properties['model']({});
}

exports.save = function(obj){
	if (typeof $ === 'undefined' && !syncOverridden) {
		console.log("$ is not defined. Overriding Backbone.sync to do nothing but log calls.");
		Backbone.sync = function(method, model, options) { 
			console.log("Backbone.sync(" + method + ", " + model + ", " + options +" )");
		};
	}
	obj.save();
	return obj;
}

exports.resolve = function(drafts, obj, property, propertyValue){
	if (property == 'model'){ return false };

	if (propertyValue instanceof Function){
		var val = propertyValue();
	}
	else{
		val = propertyValue;
	}

	obj.set(property, val);
	return false;
}
//@
