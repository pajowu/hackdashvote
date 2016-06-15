var hackvoteApp = angular.module('hackVote', ['ngRoute', 'ngWebSocket',
    'ngMaterial', 'ngResource', 'eventList', 'projectList', 'projectVote']);

hackvoteApp.controller("MainCtrl", function(){});

hackvoteApp.factory('WebsocketService', function($websocket, $http) {
    "use strict";

    var dataStream = $websocket('ws://localhost:9000');

    var messages = [];

    dataStream.onMessage(function(message) {
        console.log(message);
        //JSON.parse(e.data)
    });

    function sendData(data) {
        dataStream.send(JSON.stringify(data));
    }

    var methods = {
        send_votes: function(votes) {
            sendData(votes);
        }
    };

    return methods;

});

hackvoteApp.factory('HackDashService', ['$resource', function ($resource) {

    return $resource('https://hackdash.org/api/v2/:uri',
        {},{
           get: {method: 'GET', isArray: true}
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
        .otherwise('/events');

    }
]);