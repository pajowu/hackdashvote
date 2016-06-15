var hackvoteApp = angular.module('hackvote', ['ngRoute', 'ngWebSocket', 'eventList']);

//DataFactory stores all data and cares about refreshing it
hackvoteApp.factory('DataFactory', ['$websocket', function($websocket) {
    var methods = {};

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