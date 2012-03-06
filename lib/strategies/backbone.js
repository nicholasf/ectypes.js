//a basic local storage strategy for backbone.js

//the default number of embedded documents to create
var collectionCount = 50;

exports.setCollectionCount = function(num){
	this.collectionCount = num;
}

exports.create = function(key, properties){
	console.log(properties);
	return new properties['model']();
}

exports.save = function(obj){
	return obj.save();
}

exports.resolve = function(drafts, obj, property, propertyValue){
	console.log("drafts: ", drafts, "obj:", obj, "property:", property, "propValue:", propertyValue);
	if (propertyValue instanceof Array){
		embedded = [];

		propertyValue.forEach(function(value){
			//create instance of schema ... 
			console.log('----- ', value);
			console.log("the test >>>", (value instanceof Schema));
			console.log("* >>>>", value);
			model = this.db.model(planProperty, value)
			var count = 0;
			while (count < 50){
				test = new model();

				console.log(">>> ", value, value.constructor.name)
				embedded.push(drafts[value]());
				count++;
			}
		});

		obj[property] = embedded;
		obj =  save(obj)
	}

	return false;
}
