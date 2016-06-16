"use strict";

var hackvoteApp = angular.module('hackVote', ['ngRoute', 'ngWebSocket',
    'ngMaterial', 'ngResource', 'eventList', 'projectList', 'projectVote', 'eventResult']);

hackvoteApp.factory('WebsocketService', function($websocket, $http) {
    

    var dataStream = $websocket('ws://hackvote.pajowu.de:9000');

    var votes = {};

    dataStream.onMessage(function(message) {
        var msg = JSON.parse(message.data)
        if (msg.type == "votes") {
            votes[msg.event_name] = []
            for (var vote in msg) {
                if (typeof(msg[vote]) == "number") {
                    votes[msg.event_name].push({"id":vote, "vote":msg[vote]})
                }
            }
        }
    });

    function sendData(data) {
        dataStream.send(JSON.stringify(data));
    }

    var methods = {
        send_votes: function(votes) {
            sendData(votes);
        },
        get_votes: function(event) { sendData({"action":"get_votes", "event_name":event}) },
        votes: votes
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
        .when('/events/:eventId/results', {
            template: '<event-result></event-result>'
        })
        .otherwise('/events');

    }
]);

hackvoteApp.filter('projectVoteSort', function() {
    return function(input) {
        return input.sort(function(a,b) {
            console.log(a,b);
            return 0
        })
      
    }
  });