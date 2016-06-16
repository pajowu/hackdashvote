angular.module('eventResult', ['ngRoute']) .component('eventResult', {
    templateUrl: 'app/event-result/event-result.template.html',
    controller: function EventResultController(HackDashService, WebsocketService, $routeParams, $location, $scope) {
        var self = this;
        self.eventID = $routeParams.eventId;
        HackDashService.get({uri: self.eventID + "/projects"}, function(data){
            self.projects = {};
            for(i=0,x=data.length;i<x;i++){
                var project = data[i];
                self.projects[project._id] = project;
            }
        });
        
        WebsocketService.get_votes(self.eventID);

        self.votes = WebsocketService.votes;

        $scope.$parent.$parent.nextButtonText = null;
        $scope.$parent.$parent.nextButtonPress = null;

       
    }
});