//a sample Mongoose strategy for Drafts

//accept the client connection
//define the call from drafts to save()
//work out association function bridges

var mongooseStrategy = {}

exports.strategy = function(client){
	mongooseStrategy.client = client
}

exports.draft = function(model){
	model.save()	
}

//define "embeds"
exports.embeds = function(model){
	//create 50 of them and add them to the current model	
}