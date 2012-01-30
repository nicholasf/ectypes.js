//a test strategy; it hoards objects run through the strategy, you can check to see 
//if the appropriate methods were called

//Strategies must support save and resolve behaviours
var report = {};

function initializeReport(obj){
	identifier = obj.constructor.name
	if (report[identifier] === undefined){
		report[identifier] = {saves: 0, resolutions: 0}
	}
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

exports.report = function(){ 
	console.log(report, "<< report");
	return report
};