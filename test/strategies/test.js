//a test strategy; it hoards objects run through the strategy, you can check to see 
//if the appropriate methods were called

//Strategies must support save and resolve behaviours
var report = {};

function initializeReport(obj){
	var identifier = obj.constructor.name
	if (report[identifier] === undefined){
		report[identifier] = {saves: 0, resolutions: 0}
	}
}

exports.create = function(klass){
	obj = new klass();	
	obj.savedBy = "The Drafts Test Strategy(tm)";
	return obj;
}

exports.save = function(obj){
	initializeReport(obj)
	var saveCount = report[obj.constructor.name].saves;
	report[obj.constructor.name].saves = ++saveCount;
	obj.savedBy = "The Drafts Test Strategy(tm)";
	return obj;
}

//note this resolution returns NOTHING, so it will swallow all functions mapped to properties
exports.resolve = function(drafts, obj, prop, value){
	initializeReport(obj)
	var resolutionsCount = report[obj.constructor.name].resolutions;
	report[obj.constructor.name].resolutions = ++resolutionsCount;
}

exports.report = function(){ 
	return report;
};