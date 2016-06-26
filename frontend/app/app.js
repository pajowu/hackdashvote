"use strict";

var hackvoteApp = angular.module('hackVote', ['ngRoute', 'ngWebSocket',
    'ngMaterial', 'ngResource', 'eventList', 'projectList', 'projectVote', 'eventResult']);

hackvoteApp.factory('HackDashService', ['$resource', function ($resource) {
    return $resource('https://hackdash.org/api/v2/:uri',
        {},{
           get: {method: 'GET', isArray: true}
        }
    )
}]);

hackvoteApp.factory('BackendService', ['$resource', function ($resource) {
    return $resource('http://hackvote.pajowu.de/hackvote/api/v1.0/:action/:event_name',
        {},{
           get_votes: {method: 'GET', params: {action: "votes"}, isArray: true},
           send_votes: {method: 'POST', params: {action: "vote"}}
        }
    )
}]);

hackvoteApp.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider
        .when('/events', {
            template: '<event-list></event-list>'
        })
        .when('/events/:eventId', {
            template: '<project-list></project-list>'
        })
        .when('/events/:eventId/vote', {
            template: '<project-vote></project-vote>'
        })
        .when('/events/:eventId/results', {
            template: '<event-result></event-result>'
        })
        .otherwise('/events');

    }
]);