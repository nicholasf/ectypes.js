var ctx = require('./../lib/ectypes').createContext()
	, should = require('should')
	, Faker = require('faker2')
  , SimpleStrategy = require('./simple-strategy');

var projectBlueprint = {
	Project: {
		title: function(){ return Faker.Name.findName() }
	}
};

var multiBlueprint = [
	{Person: {
		title: function(){ return Faker.Name.findName() }
	}}
	, {Ancestor: {
		title: function(){ return Faker.Name.findName() }
	}}
];

describe('configuring strategies', function(){
	it('borks if you call ctx.add without setting a strategy', function(){
			try {
				ctx.add({Project: {}}); 
			}
			catch(err){
				err.toString().should.equal('Error: Ectypes - please set a default strategy on your context or an overriding _strategy in your blueprint.');
				should.exist(err);
			}
	});
});

describe('creating producers from blueprints', function(){

	it('creates a producer for a single blueprinted Project', function(){
		ctx.load(new SimpleStrategy());
		ctx.add(projectBlueprint);
		should.exist(ctx.Project);
	}); 

	it('creates producers for an array of blueprints', function(){
		ctx.load(new SimpleStrategy());
		ctx.add(multiBlueprint);
		should.exist(ctx.Person);
		should.exist(ctx.Ancestor);
	});

	it('maps the strategies functions onto the producer', function(){
		ctx.load(new SimpleStrategy());
		ctx.add(projectBlueprint);
		should.exist(ctx.Project.build);
	});

	it('the build function on simpleStrategy called from the producer works', function(){
		ctx.load(new SimpleStrategy());
		ctx.add(projectBlueprint);

		var cb = function(err, project){
			should.exist(project.title);
		}
		ctx.Project.build(cb);
	});
});


describe('overiding values', function(){
	ctx.load(new SimpleStrategy());
	ctx.add(projectBlueprint);

	it('without getting them confused with the cb', function(){
			var overrider = {title: 'was overridden'};
			var cb = function(err, project){
				project.title.should.equal('was overridden');				
			}

			ctx.Project.build(overrider, cb);
		});
	
		it('ignores override fields which don\'t exist', function(){
			var overrider = {obviously_not_there_title: 'was overridden', title: 'was still overrdidden'};
			var cb = function(err, project){
				project.title.should.equal('was still overrdidden');				
			}

			ctx.Project.build(overrider, cb);
		});

});
