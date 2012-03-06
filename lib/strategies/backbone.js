var Backbone = require("backbone");
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
