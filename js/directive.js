/* global Webcam */
(function(angular) {
    'use strict';

    angular
        .module('camera')
        .directive('ngCamera', directive);

    directive.$inject = ['$q', '$timeout'];



})(angular);
