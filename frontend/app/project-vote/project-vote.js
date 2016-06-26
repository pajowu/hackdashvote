angular.module('projectVote', ['ngRoute']) .component('projectVote', {
    templateUrl: 'app/project-vote/project-vote.template.html',
    controller: function ProjectVoteController(HackDashService, BackendService, $routeParams, $location, $scope) {
        var self = this;
        self.eventID = $routeParams.eventId;
        self.projects = HackDashService.get({uri: self.eventID + "/projects"});
        self.siteKey = "6LcasSITAAAAAJqb7Xdc07vYn-jdTaThwX2RIVSY";
        self.fav_project = "";
        self.sendVote = function () {
            var votes = {}
        	if (self.fav_project == "") {
                alert("You need to chose a project");
                return;
            }
        	captcha_response = grecaptcha.getResponse();
        	if (!captcha_response) {
        		alert("You need to enter the captcha");
        		return;
        	} 
            votes["vote"] = self.fav_project;
        	votes["captcha"] = captcha_response;
        	save_response = BackendService.send_votes({event_name: self.eventID}, votes);
            save_response.$promise.then(function(data) {
                console.log(data);
                if ("error" in data) {
                    alert(data["error"])
                } else {
                    $location.path("/events/"+self.eventID+"/results")
                }
            });
        	
        }

        $scope.$parent.$parent.nextButtonText = "Send Vote";
        $scope.$parent.$parent.nextButtonPress = self.sendVote;

        if (typeof grecaptcha !== 'undefined') {
        	grecaptcha.render('captcha', {
          		'sitekey' : self.siteKey
        	});
        }
       
    }
});