var db = null;

exports.setDB = function(db){
	this.db = db;
}

exports.create = function(modelName){
	Model = db.model(modelName)
	instance = new Model();
	instance.save(function(err){
		console.log("Drafts.js: ", err);
	});
	return instance;
}

exports.save = function(obj){
}

//note this resolution returns NOTHING, so it will swallow all functions mapped to properties
exports.resolve = function(obj, planProperty){
	return true;
}
