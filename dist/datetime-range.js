(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("moment"), require(undefined), require(undefined));
	else if(typeof define === 'function' && define.amd)
		define(["angular", "moment", , ], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("angular"), require("moment"), require(undefined), require(undefined)) : factory(root["angular"], root["moment"], root["moment-range"], root["moment-timezone"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var _moment = __webpack_require__(2);

	var _moment2 = _interopRequireDefault(_moment);

	var _momentRange = __webpack_require__(3);

	var _momentTimezone = __webpack_require__(4);

	var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_angular2.default.module('senzil.datetime-range', []).constant('moment', (0, _momentRange.extendMoment)(_moment2.default));

	_angular2.default.module('senzil.datetime-range').directive('timeRange', ['$document', '$timeout', 'moment', function ($document, $timeout, moment) {

	  return {
	    restrict: 'E',
	    scope: {
	      ngModel: '=',
	      includeSeconds: '<?',
	      limitsRange: '<?',
	      showClose: '<?',
	      onChange: '&?',
	      onChangeStart: '&?',
	      onChangeEnd: '&?',
	      onClose: '&?'
	    },
	    replace: true,
	    template:'<div class="datetime-range time-range"><div class="start-datetime" ng-click="selectStart(ngModel.start)" ng-class="{\'active\': selected === ngModel.start, \'warning\': warning === \'start\' }"><div class="time">{{ ngModel.start.format(includeSeconds ? \'HH : mm : ss\' : \'HH : mm\') }}</div></div><div class="end-datetime" ng-click="selectEnd(ngModel.end)" ng-class="{\'active\': selected === ngModel.end, \'warning\': warning === \'end\'}"><div class="time">{{ ngModel.end.format(includeSeconds ? \'HH : mm : ss\' : \'HH : mm\') }}</div></div><div class="edit-popover" ng-show="!!selected"><div class="timer"><div class="timer-hours" scroll-up="setDate(selected.clone().add(1, \'hours\'))" scroll-down="setDate(selected.clone().subtract(1, \'hours\'))"><div class="arrow arrow-up" ng-click="setDate(selected.clone().add(1, \'hours\'))"></div>{{ selected.format(\'HH\') }}<div class="arrow arrow-down" ng-click="setDate(selected.clone().subtract(1, \'hours\'))"></div></div><div class="timer-divider">:</div><div class="timer-minutes" scroll-up="setDate(selected.clone().add(1, \'minutes\'))" scroll-down="setDate(selected.clone().subtract(1, \'minutes\'))"><div class="arrow arrow-up" ng-click="setDate(selected.clone().add(1, \'minutes\'))"></div>{{ selected.format(\'mm\') }}<div class="arrow arrow-down" ng-click="setDate(selected.clone().subtract(1, \'minutes\'))"></div></div><div class="timer-divider" ng-show="!!includeSeconds">:</div><div class="timer-seconds" ng-show="!!includeSeconds" scroll-up="setDate(selected.clone().add(1, \'seconds\'))" scroll-down="setDate(selected.clone().subtract(1, \'seconds\'))"><div class="arrow arrow-up" ng-click="setDate(selected.clone().add(1, \'seconds\'))"></div>{{ selected.format(\'ss\') }}<div class="arrow arrow-down" ng-click="setDate(selected.clone().subtract(1, \'seconds\'))"></div></div></div><div class="close-button" ng-show="showClose"><div ng-click="close()">Close</div></div></div></div>',
	    require: 'ngModel',
	    compile: function compile() {
	      return {
	        pre: function preLink() {},
	        post: function postLink(scope, element, attr, ctrl) {
	          if (!ctrl) return;

	          scope.includeSeconds = !!scope.includeSeconds;
	          scope.showClose = !!scope.showClose;
	          scope.current = getTime(moment.tz());
	          updateLimitsRange(scope.limitsRange);
	          if (!(scope.ngModel instanceof moment.range.constructor)) {
	            scope.ngModel = moment.range(getTime(scope.current), getTime(scope.current));
	          }

	          if (moment.isMoment(scope.ngModel.start)) {
	            scope.ngModel.start = getTime(scope.ngModel.start);
	          }
	          if (moment.isMoment(scope.ngModel.end)) {
	            scope.ngModel.end = getTime(scope.ngModel.end);
	          }

	          ctrl.$render = function () {
	            var value = ctrl.$modelValue || ctrl.$viewValue;
	            if (value instanceof moment.range.constructor) {
	              value.start = getTime(value.start);
	              value.end = getTime(value.end);
	            }
	          };

	          ctrl.$validators.timerange = function (modelValue, viewValue) {

	            var value = modelValue || viewValue;

	            if (value) {
	              if (!attr.required && !value) {
	                return true;
	              }

	              if (!scope.limitsRange) {
	                return true;
	              }

	              var intersected = scope.limitsRange.intersect(value);

	              return intersected && intersected.isSame(value);
	            }

	            return !attr.required;
	          };

	          ctrl.$formatters.push(function (modelValue) {

	            if (!(modelValue instanceof moment.range.constructor)) {
	              modelValue = getTime(scope.current);
	            }
	            if (moment.isMoment(modelValue.start)) {
	              modelValue.start = getTime(modelValue.start);
	            }
	            if (moment.isMoment(modelValue.end)) {
	              modelValue.end = getTime(modelValue.end);
	            }

	            return modelValue;
	          });

	          ctrl.$parsers.push(function (viewValue) {

	            if (!viewValue) {
	              return null;
	            }

	            return viewValue;
	          });

	          function getTime(date) {
	            return moment.tz({
	              years: 0,
	              months: 0,
	              days: 0,
	              hours: date.hours(),
	              minutes: date.minutes(),
	              seconds: scope.includeSeconds ? date.seconds() : 0
	            }, 'UTC');
	          }

	          function updateLimitsRange(newValue, oldValue) {
	            if (newValue === oldValue) {
	              return;
	            }

	            if (!(scope.limitsRange instanceof moment.range.constructor)) {
	              scope.limitsRange = getTime(moment().startOf('day')).range('day');
	            }

	            if (moment.isMoment(scope.limitsRange.start)) {
	              scope.limitsRange.start = getTime(scope.limitsRange.start);
	            }

	            if (moment.isMoment(scope.limitsRange.end)) {
	              scope.limitsRange.end = getTime(scope.limitsRange.end);
	            }

	            if (scope.limitsRange.valueOf() < 0) {
	              console.warn('this directive doesn\'t support a range with negative value. Fallback to (null, null) all time constructor');
	              scope.limitsRange = getTime(moment().startOf('day')).range('day');
	            }
	          }

	          scope.selectStart = function (date) {
	            if (!date) {
	              scope.ngModel.start = scope.current.within(scope.limitsRange) ? scope.current : scope.current < scope.limitsRange.start ? scope.limitsRange.start : scope.limitsRange.end;
	              date = scope.ngModel.start;
	            }

	            return scope.selectDate(date);
	          };

	          scope.selectEnd = function (date) {
	            if (!date) {
	              scope.ngModel.end = scope.current.within(scope.limitsRange) ? scope.current : scope.current < scope.limitsRange.start ? scope.limitsRange.start : scope.limitsRange.end;
	              date = scope.ngModel.end;
	            }

	            return scope.selectDate(date);
	          };

	          // Set selected date
	          scope.selectDate = function (date) {
	            if (moment.isMoment(scope.selected) && scope.selected.isSame(date)) {
	              scope.selected = undefined;
	            } else {
	              scope.selected = date;
	            }
	          };

	          // Update selected date
	          scope.setDate = function (date) {
	            if (scope.selected.isSame(date)) {
	              return;
	            }

	            var bound = scope.selected === scope.ngModel.start ? moment.range(getTime(moment().startOf('day')), scope.ngModel.end) : moment.range(scope.ngModel.start, getTime(moment().endOf('day')));
	            var limits = (scope.limitsRange ? scope.limitsRange : getTime(moment().startOf('day')).range('day')).intersect(bound);

	            if (limits.contains(date)) {
	              scope.selected.hours(date.hours()).minutes(date.minutes()).seconds(scope.includeSeconds ? date.seconds() : 0);
	              ctrl.$validate();
	              ctrl.$setDirty();
	              scope.callback();
	            } else {
	              scope.warning = scope.selected === scope.ngModel.start ? 'start' : 'end';
	              $timeout(function () {
	                scope.warning = undefined;
	              }, 250);
	            }
	          };

	          // Callbacks fired on change of start and/or end datetime objects
	          scope.callback = function () {
	            if (!!scope.onChangeStart && scope.selected === scope.start) {
	              scope.onChangeStart();
	            }
	            if (!!scope.onChangeEnd && scope.selected === scope.end) {
	              scope.onChangeEnd();
	            }
	            if (!!scope.onChange) {
	              scope.onChange();
	            }
	          };

	          // Close edit popover
	          scope.close = function () {
	            scope.selected = null;
	            scope.onClose();
	          };

	          // Bind click events outside directive to close edit popover
	          $document.on('mousedown', function (e) {
	            if (!!scope.selected && !element[0].contains(e.target)) {
	              scope.$apply(scope.close);
	            }
	          });

	          $document.on('keyup', function (e) {
	            if (e.keyCode === 27 && !!scope.selected) {
	              scope.$apply(scope.close);
	            }
	          });

	          scope.$watch('limitsRange', updateLimitsRange);
	        }
	      };
	    }
	  };
	}]);

	_angular2.default.module('senzil.datetime-range').directive('datetimeRange', ['$document', '$timeout', 'moment', function ($document, $timeout, moment) {

	  return {
	    restrict: 'E',
	    scope: {
	      ngModel: '=',
	      timezone: '<?',
	      includeSeconds: '<?',
	      showClose: '<?',
	      limitsRange: '<?',
	      onChange: '&?',
	      onChangeStart: '&?',
	      onChangeEnd: '&?',
	      onClose: '&?'
	    },
	    replace: true,
	    template:'<div class="datetime-range"><div class="start-datetime" ng-click="selectStart(ngModel.start)" ng-class="{\'active\': selected === ngModel.start, \'warning\': warning === \'start\' }"><div class="date">{{ ngModel.start.format(\'DD MMMM YYYY\') }}</div><div class="time">{{ ngModel.start.format(includeSeconds ? \'HH : mm : ss\' : \'HH : mm\') }}</div></div><div class="end-datetime" ng-click="selectEnd(ngModel.end)" ng-class="{\'active\': selected === ngModel.end, \'warning\': warning === \'end\'}"><div class="date">{{ ngModel.end.format(\'DD MMMM YYYY\') }}</div><div class="time">{{ ngModel.end.format(includeSeconds ? \'HH : mm : ss\' : \'HH : mm\') }}</div></div><div class="edit-popover" ng-show="!!selected"><div class="calendar-toggle" ng-class="{\'start\': selected === ngModel.start, \'end\': selected === end}" ng-click="calendar_active = !calendar_active">{{ selected.format(\'DD MMMM YYYY\') }}</div><div class="calendar" ng-show="!!calendar_active"><div class="calendar-header"><div class="arrow arrow-left" ng-click="calendar.subtract(1, \'months\')"></div>{{ calendar.format(\'MMMM\') }}<div class="arrow arrow-right" ng-click="calendar.add(1, \'months\')"></div></div><div class="calendar-body"><div class="weekdays"><span class="weekday" ng-repeat="weekday in \'weeeeek\' track by $index">{{ calendar.clone().startOf(\'week\').add($index, \'days\').format(\'ddd\') }}</span></div><div class="week" ng-repeat="week in \'months\' | limitTo: ((calendar.clone().endOf(\'month\').week() - calendar.clone().startOf(\'month\').week()) + 1) track by $index"><span class="date" ng-repeat="date in \'weeeeek\' track by $index" ng-class="{ \'current\': calendar.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).startOf(\'day\').isSame(current.clone().startOf(\'day\')), \'active\': calendar.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).startOf(\'day\').isSame(selected.clone().startOf(\'day\')), \'inactive\': calendar.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).month() !== calendar.month() }" ng-click="setDate(selected.clone().year(calendar.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).year()).month(calendar.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).month()).date(calendar.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).date()), true)">{{ calendar.clone().startOf(\'month\').add($parent.$index, \'weeks\').weekday($index).date() }}</span></div></div></div><div class="timer"><div class="timer-hours" scroll-up="setDate(selected.clone().add(1, \'hours\'))" scroll-down="setDate(selected.clone().subtract(1, \'hours\'))"><div class="arrow arrow-up" ng-click="setDate(selected.clone().add(1, \'hours\'))"></div>{{ selected.format(\'HH\') }}<div class="arrow arrow-down" ng-click="setDate(selected.clone().subtract(1, \'hours\'))"></div></div><div class="timer-divider">:</div><div class="timer-minutes" scroll-up="setDate(selected.clone().add(1, \'minutes\'))" scroll-down="setDate(selected.clone().subtract(1, \'minutes\'))"><div class="arrow arrow-up" ng-click="setDate(selected.clone().add(1, \'minutes\'))"></div>{{ selected.format(\'mm\') }}<div class="arrow arrow-down" ng-click="setDate(selected.clone().subtract(1, \'minutes\'))"></div></div><div class="timer-divider" ng-show="!!includeSeconds">:</div><div class="timer-seconds" ng-show="!!includeSeconds" scroll-up="setDate(selected.clone().add(1, \'seconds\'))" scroll-down="setDate(selected.clone().subtract(1, \'seconds\'))"><div class="arrow arrow-up" ng-click="setDate(selected.clone().add(1, \'seconds\'))"></div>{{ selected.format(\'ss\') }}<div class="arrow arrow-down" ng-click="setDate(selected.clone().subtract(1, \'seconds\'))"></div></div></div><div class="close-button" ng-show="showClose"><div ng-click="close()">Close</div></div></div></div>',
	    require: 'ngModel',
	    compile: function compile() {
	      return {
	        pre: function preLink() {},
	        post: function postLink(scope, element, attr, ctrl) {
	          if (!ctrl) return;

	          scope.includeSeconds = !!scope.includeSeconds;
	          scope.showClose = !!scope.showClose;
	          scope.current = moment.tz(scope.timezone);

	          updateTimezone(scope.timezone);

	          ctrl.$render = function () {
	            var value = ctrl.$modelValue || ctrl.$viewValue;

	            if (value instanceof moment.range.constructor) {
	              value.start = moment.tz(value.start, scope.timezone);
	              value.end = moment.tz(value.end, scope.timezone);
	            }
	          };

	          ctrl.$validators.timerange = function (modelValue, viewValue) {

	            var value = modelValue || viewValue;

	            if (value) {
	              if (!attr.required && !value) {
	                return true;
	              }

	              if (!scope.limitsRange) {
	                return true;
	              }

	              var intersected = scope.limitsRange.intersect(value);

	              return intersected && intersected.isSame(value);
	            }

	            return !attr.required;
	          };

	          ctrl.$formatters.push(function (modelValue) {

	            if (!(modelValue instanceof moment.range.constructor)) {
	              modelValue = moment.range(scope.current, scope.current);
	            }
	            if (moment.isMoment(modelValue.start)) {
	              modelValue.start = moment.tz(modelValue.start, scope.timezone);
	            }
	            if (moment.isMoment(modelValue.end)) {
	              modelValue.end = moment.tz(modelValue.end, scope.timezone);
	            }

	            return modelValue;
	          });

	          ctrl.$parsers.push(function (viewValue) {

	            if (!viewValue) {
	              return null;
	            }

	            return viewValue;
	          });

	          function updateTimezone(newValue, oldValue) {
	            if (newValue === oldValue) {
	              return;
	            }
	            scope.timezone = scope.timezone || moment.tz.guess();

	            updateLimitsRange(scope.limitsRange);

	            if (!(scope.ngModel instanceof moment.range.constructor)) {
	              scope.ngModel = moment.range(scope.current, scope.current);
	            }

	            if (moment.isMoment(scope.ngModel.start)) {
	              scope.ngModel.start = moment.tz(scope.ngModel.start, scope.timezone);
	            }
	            if (moment.isMoment(scope.ngModel.end)) {
	              scope.ngModel.end = moment.tz(scope.ngModel.end, scope.timezone);
	            }
	          }

	          function updateLimitsRange(newValue, oldValue) {
	            if (newValue === oldValue) {
	              return;
	            }

	            if (!(scope.limitsRange instanceof moment.range.constructor)) {
	              scope.limitsRange = moment.range(null, null);
	            } else if (scope.limitsRange.valueOf() < 0) {
	              console.warn('this directive doesn\'t support a range with negative value. Fallback to (null, null) all time constructor');
	              scope.limitsRange = moment.range(null, null);
	            }

	            if (moment.isMoment(scope.limitsRange.start)) {
	              scope.limitsRange.start = moment.tz(scope.limitsRange.start, scope.timezone);
	            }
	            if (moment.isMoment(scope.limitsRange.end)) {
	              scope.limitsRange.end = moment.tz(scope.limitsRange.end, scope.timezone);
	            }
	          }

	          scope.selectStart = function (date) {
	            if (!date) {
	              scope.ngModel.start = scope.current.within(scope.limitsRange) ? scope.current : scope.current < scope.limitsRange.start ? scope.limitsRange.start : scope.limitsRange.end;

	              date = scope.ngModel.start;
	            }

	            return scope.selectDate(date);
	          };

	          scope.selectEnd = function (date) {
	            if (!date) {
	              scope.ngModel.end = scope.current.within(scope.limitsRange) ? scope.current : scope.current < scope.limitsRange.start ? scope.limitsRange.start : scope.limitsRange.end;

	              date = scope.ngModel.end;
	            }

	            return scope.selectDate(date);
	          };

	          // Set selected date
	          scope.selectDate = function (date) {
	            if (moment.isMoment(scope.selected) && scope.selected.isSame(date)) {
	              scope.selected = undefined;
	            } else {
	              scope.selected = date;
	              scope.calendar = scope.selected.clone();
	            }
	          };

	          // Update selected date
	          scope.setDate = function (date, calendar_update) {
	            if (scope.selected.isSame(date)) {
	              return;
	            }

	            var bound = scope.selected === scope.ngModel.start ? moment.range(null, scope.ngModel.end) : moment.range(scope.ngModel.start, null);
	            var limits = (scope.limitsRange ? scope.limitsRange : moment.range(null, null)).intersect(bound);

	            //is in current valid range
	            if (limits.contains(date)) {
	              //date to selected
	              scope.selected.year(date.year()).month(date.month()).date(date.date()).hours(date.hours()).minutes(date.minutes()).seconds(scope.includeSeconds ? date.seconds() : 0);
	              if (scope.selected.clone().startOf('week').month() !== scope.calendar.month() && scope.selected.clone().endOf('week').month() !== scope.calendar.month() || calendar_update) {
	                scope.calendar = scope.selected.clone();
	              }
	              //TODO: check ngModel Assign
	              ctrl.$validate();
	              ctrl.$setDirty();
	              scope.callback();
	            } else {
	              scope.warning = scope.selected === scope.ngModel.start ? 'start' : 'end';
	              $timeout(function () {
	                scope.warning = undefined;
	              }, 250);
	            }
	          };

	          // Callbacks fired on change of start and/or end datetime objects
	          scope.callback = function () {
	            if (!!scope.onChangeStart && scope.selected.isSame(scope.ngModel.start)) {
	              scope.onChangeStart();
	            }
	            if (!!scope.onChangeEnd && scope.selected.isSame(scope.ngModel.end)) {
	              scope.onChangeEnd();
	            }
	            if (!!scope.onChange) {
	              scope.onChange();
	            }
	          };

	          // Close edit popover
	          scope.close = function () {
	            scope.selected = '';
	            scope.calendar_active = false;
	            if (scope.onClose) {
	              scope.onClose();
	            }
	          };

	          // Bind click events outside directive to close edit popover
	          $document.on('mousedown', function (e) {
	            if (!!scope.selected && !element[0].contains(e.target)) {
	              scope.$apply(scope.close);
	            }
	          });

	          $document.on('keyup', function (e) {
	            if (e.keyCode === 27 && !!scope.selected) {
	              scope.$apply(scope.close);
	            }
	          });

	          scope.$watch('timezone', updateTimezone);
	          scope.$watch('limitsRange', updateLimitsRange);
	        }
	      };
	    }
	  };
	}]);

	_angular2.default.module('senzil.datetime-range').directive('scrollUp', function () {
	  return {
	    restrict: 'A',
	    compile: function compile() {
	      return {
	        pre: function preLink() {},
	        post: function postLink(scope, element, attrs) {

	          element.on('DOMMouseScroll mousewheel wheel touchmove', function (ev) {
	            ev = ev.originalEvent || ev;
	            var delta = ev.wheelDelta || -1 * ev.deltaY || 0;
	            if (delta > 0) {
	              scope.$apply(function () {
	                scope.$eval(attrs.scrollUp);
	              });
	              ev.preventDefault();
	            }
	          });
	        }
	      };
	    }
	  };
	});

	_angular2.default.module('senzil.datetime-range').directive('scrollDown', function () {
	  return {
	    restrict: 'A',
	    compile: function compile() {
	      return {
	        pre: function preLink() {},
	        post: function postLink(scope, element, attrs) {
	          element.on('DOMMouseScroll mousewheel wheel touchmove', function (ev) {
	            ev = ev.originalEvent || ev;
	            var delta = ev.wheelDelta || -1 * ev.deltaY || 0;
	            if (delta < 0) {
	              scope.$apply(function () {
	                scope.$eval(attrs.scrollDown);
	              });
	              ev.preventDefault();
	            }
	          });
	        }
	      };
	    }
	  };
	});

	exports.default = _angular2.default.module('senzil.datetime-range').name;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ })
/******/ ])
});
;