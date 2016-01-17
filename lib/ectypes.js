var ectypes = {};

var package = require('./../package.json')
    , _     = require('underscore')
    , async = require('async');

ectypes.VERSION   = package.version;
ectypes.types     = [];
ectypes.producers = [];

ectypes.generateBlueprintData = function(blueprint, cb) {
    var transformedVals      = {};
    var ectypeName           = _.keys(blueprint)[0];
    var blueprintObjects     = blueprint[ectypeName];
    blueprintObjects.befores = (blueprintObjects.befores || [])

    async.waterfall(blueprintObjects.befores, function(err, beforeVals) {

        for (var key in blueprintObjects) {
            if (blueprintObjects[key] instanceof Array) {
                continue;
            }
            else {
                transformedVals[key] = blueprintObjects[key].call();
            }
        }
        _.extend(transformedVals, beforeVals);
        cb(null, transformedVals);
    })
}

/* Takes a blueprint like:
 **  {	Project: {
 **		title: function(){ return Faker.Name.findName() }
 ** 	}
 ** }
 **
 ** and sets a producer on the context like
 **
 ** context.Project
 **
 ** that can call any strategy function and pass it
 ** blueprint values that have been transformed - e.g. a title string.
 */
ectypes.createProducer = function(context, blueprint) {
    var chosenStrategy, producerName, producer;
    context.blueprintsCabinet.push(blueprint);

    if (blueprint._strategy) {
        chosenStrategy = blueprint._strategy;
    }
    else {
        chosenStrategy = context.strategy;
    }

    if (!chosenStrategy) {
        throw new Error("Ectypes - please set a default strategy on your context or an overriding _strategy in your blueprint.");
    }

    producerName          = _.keys(blueprint)[0];
    context[producerName] = {};

    var ignores = chosenStrategy.ignores;

    var strategyFuncNames = [];
    for (var strategyFuncName in chosenStrategy) {
        if (!_.contains(chosenStrategy.ignores, strategyFuncName)) {
            strategyFuncNames.push(strategyFuncName);
        }
    }

    var f1 = function(strategyFuncName, cb) {
        context[producerName][strategyFuncName] = function(arg1, arg2) {
            var cb2, overridingValues;

            if (typeof arg1 === 'function') {
                cb2 = arg1;
            }
            else {
                overridingValues = arg1;
                cb2              = arg2;
            }

            ectypes.generateBlueprintData(blueprint, function(err, data) {
                for (var key in overridingValues) {
                    data[key] = overridingValues[key];
                }

                chosenStrategy[strategyFuncName](producerName, data, function(err, obj) {
                    cb2(err, obj);
                });
            });
        }
        cb();
    };

    async.forEach(strategyFuncNames, f1)
}

ectypes.Context = function() {
    this.blueprintsCabinet = [];
    this.strategy;

    this.load = function(strategy) {
        this.strategy = strategy;
    };

    //add blueprints to a context - they'll either arrive grouped in an array or alone
    this.add = function(blueprints) {
        if (Object.prototype.toString.call(blueprints) === '[object Array]') {
            var self = this;
            blueprints.forEach(function(blueprint) {
                ectypes.createProducer(self, blueprint);
            });
        }
        else {
            var blueprint = blueprints; //a singular blueprint
            ectypes.createProducer(this, blueprint);
        }
    };
};

exports.createContext = function() {
    return new ectypes.Context();
};

exports.Context = ectypes.Context;
