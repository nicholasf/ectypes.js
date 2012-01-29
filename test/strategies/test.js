//a test strategy; it hoards objects run through the strategy, you can check to see 
//if the appropriate methods were called

//Strategies must support save and resolve behaviours
var report = {};

function initialize(obj){
	klass = typeof obj
	if (report[klass] === undefined){
		report[klass] = {saves: 0, resolutions: 0}
	}
}

exports.save = function(obj){
	console.log(">>>>", typeof obj)
	initialize(obj)
	var saveCount = report[typeof obj].saves;
	report[typeof obj].saves = ++saveCount;
	obj.madeBy = "The Drafts Test Strategy(tm)";
}

//note this resolution returns NOTHING, so it will swallow all functions mapped to properties
exports.resolve = function(obj, planProperty){
	initialize(obj)
	var resolutionsCount = report[typeof obj].resolutions;
	report[typeof obj].resolutions = ++resolutionCount;	
}

exports.report = function(){ 
	console.log(report, "<< report");
	return report
};