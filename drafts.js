var Drafts = {}

Drafts.version = "0.0.0";
Drafts._plans = [];	

Drafts.plan = function (plannedObj){
	this._plans.push(plannedObj)
}


if(typeof exports != "undefined"){for (var prop in Drafts){exports[prop] = Drafts[prop];}}