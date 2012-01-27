//method call after each addition to plans
//build plan objects

var drafts = {}

drafts.VERSION = "0.0.0";
drafts.plans = [];	
drafts.vanilla = {}

drafts._build = function(){
	this.plans.forEach(function(plan){			
			//if no match, then create a vanilla object
			for (p in plan){
				className = p.charAt(0).toUpperCase() + p.slice(1);
				constant = global[className]

				if (constant === undefined){
					drafts.vanilla[p] = plan[p];
				}
				else {
					//take each plan, scan each first level property in plan for a matching model
					//console.log("verified that ", className, "is a valid js object");
					//this constructor function should be wrapped by strategy functionality that obeys a common lifecycle
					//and that leverages the expressed plan

					//1. create the object via the strategy
					//2. fulfil the plan
					//2.1 each value of the plan should be passed to the strategy, which than work out how to fulfill it.

					drafts[className] = constant;
					exports[className] = constant;

					// constant.prototype.draft = function(){ return "hello!"};
					// console.log("added!, ",  String);

					//if the object is defined then add a .draft() method to it
					//subsequently, when draft() is triggered each variable and value (k,v) on the obj
					//will be passed through to the strategy, before Drafts attempts to resolve it
					//the strategy can then decide what to do with it, or simply return null
				}

			}
		}
	) 
}

drafts.plan = function (plannedObj){
	this.plans.push(plannedObj)
	this._build();
}

if(typeof exports != "undefined"){for (var prop in drafts){exports[prop] = drafts[prop];}}