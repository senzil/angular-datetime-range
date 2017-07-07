//var angular = require('angular');
//var moment = require('moment');
//var extendMoment = require('moment-range').extendMoment();
//var timezone = require('moment-timezone');
var datetimeRange = require('./dist/datetime-range.js').default;
//angular.module(datetimeRange).constant('moment', extendMoment(moment));

module.exports = datetimeRange;
