//method call after each addition to plans
//build plan objects

var drafts = {}

drafts.VERSION = "0.0.0";
drafts.plans = [];	
drafts.vanilla = {}

drafts._build = function(){
	this.plans.forEach(function(plan){
			// console.log(">>", plan);

			//take each plan, scan each first level property in plan for a matching model
			//if no match, then create a vanilla object
			for (p in plan){
				// console.log(">>", p);
				drafts.vanilla[p] = plan[p];
			}
		}
	) 
}

drafts.plan = function (plannedObj){
	this.plans.push(plannedObj)
	this._build();
}



if(typeof exports != "undefined"){for (var prop in drafts){exports[prop] = drafts[prop];}}