angular.module('eventList', ['ngRoute']).component('eventList', {
    templateUrl: 'app/event-list/event-list.template.html',
    controller: function PhoneListController(HackDashService, $location, $scope) {
        var self = this;

        self.events = HackDashService.get({uri:"dashboards"});

        self.showVote = function (id) {
        	$location.path("/events/"+id)
        }

        $scope.$parent.$parent.nextButtonText = null;
        $scope.$parent.$parent.nextButtonPress = null;
    }
});