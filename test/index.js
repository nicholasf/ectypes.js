should = require('should');

describe( 'index.js loads', function(){
	mill = require('../lib/mill');
	index = require('../index');
	index.should.eql(mill)
})