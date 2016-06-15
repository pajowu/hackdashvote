angular.module('projectList', ['ngRoute']) .component('projectList', {
    templateUrl: 'app/project-list/project-list.template.html',
    controller: function ProjectListController(HackDashService, $routeParams, $location, $scope) {
        var self = this;
        self.eventID = $routeParams.eventId;
        self.projects = HackDashService.get({uri: self.eventID + "/projects"});


        self.vote = function () {
        	$location.path("/events/"+self.eventID+"/vote")
        };

        $scope.$parent.$parent.nextButtonText = "Go to Vote";
        $scope.$parent.$parent.nextButtonPress = self.vote;
        console.log($scope)
    }
});