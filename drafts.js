var drafts = {}

drafts.VERSION = "0.0.0";
drafts._plans = [];	

drafts._plan = function (plannedObj){
	this._plans.push(plannedObj)
}


if(typeof exports != "undefined"){for (var prop in drafts){exports[prop] = drafts[prop];}}