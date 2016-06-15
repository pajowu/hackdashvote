var hackvoteApp = angular.module('hackvote', ['ngRoute', 'ngWebSocket', 'eventList']);

//DataFactory stores all data and cares about refreshing it
hackvoteApp.factory('DataFactory', ['$websocket', function($websocket) {
    "use strict";

    var dataStream = $websocket('ws://localhost:9000');

    var events, projects = [];

    dataStream.onMessage(function(message) {
        console.log(message);
    });

    function sendData(data) {
        dataStream.send(JSON.stringify(data));
    }
    var methods = {
        events: events,
        get_events: function() {
            sendData({ action: 'get_projects' });
        },
        get_event: function() {
            sendData({ action: 'get_projects' });
        }
    };

    return methods;
}]);

hackvoteApp.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider
        .when('/events', {
            template: '<event-list></event-list>'
        })
        .when('/events/:eventId', {
            template: '<event-detail></event-detail>'
        })
        .when('/events/:eventId/projects', {
            template: '<project-list></project-list>'
        })
        .when('/events/:eventId/projects/:projectId', {
            template: '<project-detail></project-detail>'
        })
        .otherwise('/events');

    }
]);