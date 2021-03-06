'use strict';

/**
 * Module to use Switchery as a directive for angular.
 *
 * @TODO implement Switchery as a service, https://github.com/abpetkov/switchery/pull/11
 */
angular.module('NgSwitchery', [])
  .directive('uiSwitch', ['$window', '$timeout', '$log', '$parse', function ($window, $timeout, $log, $parse) {

    /**
     * Initializes the HTML element as a Switchery switch.
     *
     * $timeout is in place as a workaround to work within angular-ui tabs.
     *
     * @param scope
     * @param elem
     * @param attrs
     * @param ngModel
     */
    function linkSwitchery (scope, elem, attrs, ngModel) {

      elem[0].on = function () {
        this.checked = true;
        this.nextElementSibling.style.backgroundColor = 'rgb(100, 189, 99)';
        this.nextElementSibling.style.borderColor = 'rgb(100, 189, 99)';
        this.nextElementSibling.style.boxShadow = 'rgb(100, 189, 99) 0px 0px 0px 16px inset';
        this.nextElementSibling.style.transition = 'border 0.4s, box-shadow 0.4s, background-color 1.2s';
        this.nextElementSibling.childNodes[0].style.left = '13px';
        this.nextElementSibling.childNodes[0].style.transition = 'background-color 0.4s, left 0.2s';
        this.nextElementSibling.childNodes[0].style.backgroundColor = 'rgb(255, 255, 255)';
      };

      elem[0].off = function () {
        this.checked = false;
        this.nextElementSibling.style.backgroundColor = 'rgb(255, 255, 255)';
        this.nextElementSibling.style.borderColor = 'rgb(223, 223, 223)';
        this.nextElementSibling.style.boxShadow = 'rgb(223, 223, 223) 0px 0px 0px 0px inset';
        this.nextElementSibling.style.transition = 'border 0.4s, box-shadow 0.4s';
        this.nextElementSibling.childNodes[0].style.left = '0px';
        this.nextElementSibling.childNodes[0].style.transition = 'background-color 0.4s, left 0.2s';
      };

      elem[0].ontoggle = function(){
        if(!!this.checked){
          this.off()
        }else{
          this.on()
        }
      };
      // if (!ngModel) return false;
      var options = {};
      try {
        options = $parse(attrs.uiSwitch)(scope);
      } catch (e) {
      }

      var switcher;

      attrs.$observe('disabled', function (value) {
        if (!switcher) {
          return;
        }

        if (value) {
          switcher.disable();
        } else {
          switcher.enable();
        }
      });

      // Watch changes
      scope.$watch(function () {
        // return ngModel.$modelValue;
      }, function (newValue, oldValue) {
        // initializeSwitch()
      });

      function initializeSwitch () {
        $timeout(function () {
          // Remove any old switcher
          if (switcher) {
            angular.element(switcher.switcher).remove();
          }
          // (re)create switcher to reflect latest state of the checkbox element
          switcher = new $window.Switchery(elem[0], options);
          var element = switcher.element;
          element.checked = scope.initValue;
          if (attrs.disabled) {
            switcher.disable();
          }

          switcher.setPosition(false);
          element.addEventListener('change', function (evt) {
            scope.$apply(function () {
              // ngModel.$setViewValue(element.checked);
            })
          });
          scope.$watch('initValue', function (newValue, oldValue) {
            switcher.setPosition(false);
          });
        }, 0);
      }

      initializeSwitch();
    }

    return {
      // require: 'ngModel',
      restrict: 'AE',
      scope: {
        initValue: '=ngChecked'
      },
      link: linkSwitchery
    }
  }]);
