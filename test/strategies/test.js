//a test strategy; it hoards objects run through the strategy, you can check to see 
//if the appropriate methods were called

//Strategies must support save and resolve behaviours
var report = {};

exports.save = function(obj){
	if (report[obj] === undefined){
		report[obj] = 0
	}
	var saveCount = report[obj];
	report[obj] = ++saveCount;
	obj.madeBy = "The Drafts Test Strategy(tm)";
}

exports.resolve = function(obj, planProperty){
	
}

exports.report = report;