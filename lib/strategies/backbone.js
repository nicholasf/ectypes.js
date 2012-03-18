var Backbone = require("backbone");

//@BROWSER-begins
bbStrategy = {}

bbStrategy.setCollectionCount = function(num){
	this.collectionCount = num;
}

bbStrategy.create = function(key, properties){
	return new properties['model']({});
}

bbStrategy.save = function(obj){
	if (typeof $ === 'undefined') {
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

	obj.set(property, val);
	return false;
}

bbStrategy.overrideProperty = function (obj, property, value){ 
	obj.set(property, value);
	return obj;
} 

//@BROWSER-ends
for (var prop in bbStrategy){exports[prop] = bbStrategy[prop];}