var client = null;

exports.setClient = function(client){
	this.client = client;
}

exports.save = function(obj){
	initializeReport(obj)
	var saveCount = report[obj.constructor.name].saves;
	report[obj.constructor.name].saves = ++saveCount;
	obj.madeBy = "The Drafts Test Strategy(tm)";
	return obj;
}

//note this resolution returns NOTHING, so it will swallow all functions mapped to properties
exports.resolve = function(obj, planProperty){
	initializeReport(obj)
	var resolutionsCount = report[obj.constructor.name].resolutions;
	report[obj.constructor.name].resolutions = ++resolutionCount;	
}
