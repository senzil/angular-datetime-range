'use strict';

import angular from 'angular';
import Moment from 'moment';
import {extendMoment} from 'moment-range';
import momentTimezone from 'moment-timezone';

angular.module('senzil.datetime-range',[]).constant('moment', extendMoment(Moment));

angular.module('senzil.datetime-range').
  directive('timeRange', ['$document', '$timeout', 'moment', function ($document, $timeout, moment) {

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
    templateUrl: './time-range.html',
    require: 'ngModel',
    compile: function () {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element, attr, ctrl) {
          if (!ctrl) return;

          scope.includeSeconds = !!scope.includeSeconds;
          scope.showClose = !!scope.showClose;
          scope.current = getTime(moment.tz());
          updateLimitsRange(scope.limitsRange);
          if(!(scope.ngModel instanceof moment.range.constructor)){
            scope.ngModel = moment.range(getTime(scope.current), getTime(scope.current));
          }

          if(moment.isMoment(scope.ngModel.start)){
            scope.ngModel.start = getTime(scope.ngModel.start);
          }
          if(moment.isMoment(scope.ngModel.end)){
            scope.ngModel.end = getTime(scope.ngModel.end);
          }

          ctrl.$render = function() {
            let value = ctrl.$modelValue || ctrl.$viewValue;
            if(value instanceof moment.range.constructor) {
              value.start = getTime(value.start);
              value.end = getTime(value.end);
            }
          };

          ctrl.$validators.timerange = function(modelValue, viewValue) {

            let value = modelValue || viewValue;

            if(value) {
              if(!attr.required && !value){
                return true;
              }

              if(!scope.limitsRange) {
                return true;
              }

              const intersected = scope.limitsRange.intersect(value);

              return intersected && intersected.isSame(value);
            }

            return !attr.required;
          };

          ctrl.$formatters.push(function(modelValue) {

            if(!(modelValue instanceof moment.range.constructor)){
              modelValue = getTime(scope.current);
            }
            if(moment.isMoment(modelValue.start)){
              modelValue.start = getTime(modelValue.start);
            }
            if(moment.isMoment(modelValue.end)){
              modelValue.end = getTime(modelValue.end);
            }

            return modelValue;
          });

          ctrl.$parsers.push( function(viewValue) {

            if(!viewValue) {
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
            if(newValue === oldValue){
              return;
            }

            if(!(scope.limitsRange instanceof moment.range.constructor)){
              scope.limitsRange = getTime(moment().startOf('day')).range('day');
            }

            if(moment.isMoment(scope.limitsRange.start)){
              scope.limitsRange.start = getTime(scope.limitsRange.start);
            }

            if(moment.isMoment(scope.limitsRange.end)){
              scope.limitsRange.end = getTime(scope.limitsRange.end);
            }

            if(scope.limitsRange.valueOf() < 0) {
              console.warn('this directive doesn\'t support a range with negative value. Fallback to (null, null) all time constructor');
              scope.limitsRange = getTime(moment().startOf('day')).range('day');
            }
          }

          scope.selectStart = function(date) {
            if(!date) {
              scope.ngModel.start = scope.current.within(scope.limitsRange) ? scope.current : scope.current < scope.limitsRange.start ? scope.limitsRange.start : scope.limitsRange.end;
              date = scope.ngModel.start;
            }

            return scope.selectDate(date);
          };

          scope.selectEnd = function(date) {
            if(!date) {
              scope.ngModel.end = scope.current.within(scope.limitsRange) ? scope.current : scope.current < scope.limitsRange.start ? scope.limitsRange.start : scope.limitsRange.end;
              date = scope.ngModel.end;
            }

            return scope.selectDate(date);
          };

          // Set selected date
          scope.selectDate = function (date) {
            if ( moment.isMoment(scope.selected) && scope.selected.isSame(date) ) {
              scope.selected = undefined;
            } else {
              scope.selected = date;
            }
          };

          // Update selected date
          scope.setDate = function (date) {
            if ( scope.selected.isSame(date) ) { return; }

            let bound = scope.selected === scope.ngModel.start ? moment.range(getTime(moment().startOf('day')), scope.ngModel.end) : moment.range(scope.ngModel.start, getTime(moment().endOf('day')));
            let limits = (scope.limitsRange ? scope.limitsRange : getTime(moment().startOf('day')).range('day')).intersect(bound);


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
            if ( !!scope.onChangeStart && scope.selected === scope.ngModel.start ) {
              scope.onChangeStart();
            }
            if ( !!scope.onChangeEnd && scope.selected === scope.ngModel.end ) {
              scope.onChangeEnd();
            }
            if ( !!scope.onChange ) {
              scope.onChange();
            }
          };

          // Close edit popover
          scope.close = function () {
            scope.selected = null;
            if(scope.onClose) {
              scope.onClose();
            }
          };

          // Bind click events outside directive to close edit popover
          $document.on('mousedown', function (e) {
            if ( !!scope.selected && !element[0].contains(e.target) ) {
              scope.$apply(scope.close);
            }
          });

          $document.on('keyup', function (e) {
            if ( e.keyCode === 27 && !!scope.selected ) {
              scope.$apply(scope.close);
            }
          });

          scope.$watch('limitsRange', updateLimitsRange);
        }
      };
    }
  };
}]);

angular.module('senzil.datetime-range').
directive('datetimeRange', ['$document', '$timeout', 'moment', function ($document, $timeout, moment) {

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
    templateUrl: './datetime-range.html',
    require: 'ngModel',
    compile: function () {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element, attr, ctrl) {
          if (!ctrl) return;

          scope.includeSeconds = !!scope.includeSeconds;
          scope.showClose = !!scope.showClose;
          scope.current = moment.tz(scope.timezone);

          updateTimezone(scope.timezone);

          ctrl.$render = function() {
            let value = ctrl.$modelValue || ctrl.$viewValue;

            if(value instanceof moment.range.constructor) {
              value.start = moment.tz(value.start, scope.timezone);
              value.end = moment.tz(value.end, scope.timezone);
            }
          };

          ctrl.$validators.timerange = function(modelValue, viewValue) {

            let value = modelValue || viewValue;

            if(value) {
              if(!attr.required && !value){
                return true;
              }

              if(!scope.limitsRange) {
                return true;
              }

              const intersected = scope.limitsRange.intersect(value);

              return intersected && intersected.isSame(value);
            }

            return !attr.required;
          };

          ctrl.$formatters.push(function(modelValue) {

            if(!(modelValue instanceof moment.range.constructor)){
              modelValue = moment.range(scope.current, scope.current);
            }
            if(moment.isMoment(modelValue.start)){
              modelValue.start = moment.tz(modelValue.start, scope.timezone);
            }
            if(moment.isMoment(modelValue.end)){
              modelValue.end = moment.tz(modelValue.end, scope.timezone);
            }

            return modelValue;
          });

          ctrl.$parsers.push( function(viewValue) {

            if(!viewValue) {
              return null;
            }

            return viewValue;
          });

          function updateTimezone(newValue, oldValue) {
            if(newValue === oldValue){
              return;
            }
            scope.timezone = scope.timezone || moment.tz.guess();

            updateLimitsRange(scope.limitsRange);

            if(!(scope.ngModel instanceof moment.range.constructor)){
              scope.ngModel = moment.range(scope.current, scope.current);
            }

            if(moment.isMoment(scope.ngModel.start)){
              scope.ngModel.start = moment.tz(scope.ngModel.start, scope.timezone);
            }
            if(moment.isMoment(scope.ngModel.end)){
              scope.ngModel.end = moment.tz(scope.ngModel.end, scope.timezone);
            }
          }

          function updateLimitsRange(newValue, oldValue) {
            if(newValue === oldValue){
              return;
            }

            if(!(scope.limitsRange instanceof moment.range.constructor)){
              scope.limitsRange = moment.range(null, null);
            } else if(scope.limitsRange.valueOf() < 0) {
              console.warn('this directive doesn\'t support a range with negative value. Fallback to (null, null) all time constructor');
              scope.limitsRange = moment.range(null, null);
            }

            if(moment.isMoment(scope.limitsRange.start)){
              scope.limitsRange.start = moment.tz(scope.limitsRange.start, scope.timezone);
            }
            if(moment.isMoment(scope.limitsRange.end)){
              scope.limitsRange.end = moment.tz(scope.limitsRange.end, scope.timezone);
            }
          }

          scope.selectStart = function(date) {
            if(!date) {
              scope.ngModel.start = scope.current.within(scope.limitsRange) ? scope.current : scope.current < scope.limitsRange.start ? scope.limitsRange.start : scope.limitsRange.end;

              date = scope.ngModel.start;
            }

            return scope.selectDate(date);
          };

          scope.selectEnd = function(date) {
            if(!date) {
              scope.ngModel.end = scope.current.within(scope.limitsRange) ? scope.current : scope.current < scope.limitsRange.start ? scope.limitsRange.start : scope.limitsRange.end;

              date = scope.ngModel.end;
            }

            return scope.selectDate(date);
          };

          // Set selected date
          scope.selectDate = function (date) {
            if ( moment.isMoment(scope.selected) && scope.selected.isSame(date) ) {
              scope.selected = undefined;
            } else {
              scope.selected = date;
              scope.calendar = scope.selected.clone();
            }
          };

          // Update selected date
          scope.setDate = function (date, calendar_update) {
            if ( scope.selected.isSame(date) ) { return; }

            let bound = scope.selected === scope.ngModel.start ? moment.range(null, scope.ngModel.end) : moment.range(scope.ngModel.start, null);
            let limits = (scope.limitsRange ? scope.limitsRange : moment.range(null, null)).intersect(bound);


            //is in current valid range
            if (limits.contains(date)) {
              //date to selected
              scope.selected.year(date.year()).month(date.month()).date(date.date()).hours(date.hours()).minutes(date.minutes()).seconds(scope.includeSeconds ? date.seconds() : 0);
              if ( (scope.selected.clone().startOf('week').month() !== scope.calendar.month() && scope.selected.clone().endOf('week').month() !== scope.calendar.month()) || calendar_update ) {
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
            if ( !!scope.onChangeStart && scope.selected === scope.ngModel.start) {
              scope.onChangeStart();
            }
            if ( !!scope.onChangeEnd && scope.selected === scope.ngModel.end) {
              scope.onChangeEnd();
            }
            if ( !!scope.onChange ) {
              scope.onChange();
            }
          };

          // Close edit popover
          scope.close = function () {
            scope.selected = '';
            scope.calendar_active = false;
            if(scope.onClose){
              scope.onClose();
            }
          };

          // Bind click events outside directive to close edit popover
          $document.on('mousedown', function (e) {
            if ( !!scope.selected && !element[0].contains(e.target) ) {
              scope.$apply(scope.close);
            }
          });

          $document.on('keyup', function (e) {
            if ( e.keyCode === 27 && !!scope.selected ) {
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

angular.module('senzil.datetime-range').
  directive('scrollUp', function () {
  return {
    restrict: 'A',
    compile: function () {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element, attrs) {

          element.on('DOMMouseScroll mousewheel wheel touchmove', function (ev) {
            ev = ev.originalEvent || ev;
            let delta = ev.wheelDelta || (-1 * ev.deltaY) || 0;
            if ( delta > 0 ) {
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

angular.module('senzil.datetime-range').
  directive('scrollDown', function () {
  return {
    restrict: 'A',
    compile: function () {
      return {
        pre: function preLink() {},
        post: function postLink(scope, element, attrs) {
          element.on('DOMMouseScroll mousewheel wheel touchmove', function (ev) {
            ev = ev.originalEvent || ev;
            let delta = ev.wheelDelta || (-1 * ev.deltaY) || 0;
            if ( delta < 0 ) {
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


export default angular.module('senzil.datetime-range').name;