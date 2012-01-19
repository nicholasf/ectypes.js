var should = require('should');

describe( 'index.js loads', function(){
	mill = require('../lib/drafts');
	index = require('../index');
	index.should.eql(mill)
})