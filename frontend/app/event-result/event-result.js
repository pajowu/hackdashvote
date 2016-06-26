angular.module('eventResult', ['ngRoute']) .component('eventResult', {
    templateUrl: 'app/event-result/event-result.template.html',
    controller: function EventResultController(HackDashService, BackendService, $routeParams, $location, $scope) {
        var self = this;
        self.eventID = $routeParams.eventId;
        HackDashService.get({uri: self.eventID + "/projects"}, function(data){
            self.projects = {};
            for(i=0,x=data.length;i<x;i++){
                var project = data[i];
                self.projects[project._id] = project;
            }
        });
        
        self.votes = BackendService.get_votes({event_name: self.eventID});

        $scope.$parent.$parent.nextButtonText = null;
        $scope.$parent.$parent.nextButtonPress = null;

       
    }
});