angular.module('projectVote', ['ngRoute']) .component('projectVote', {
    templateUrl: 'app/project-vote/project-vote.template.html',
    controller: function ProjectListController(HackDashService, WebsocketService, $routeParams, $location, $scope) {
        var self = this;
        self.eventID = $routeParams.eventId;
        self.projects = HackDashService.get({uri: self.eventID + "/projects"});

        self.sendVote = function () {
        	console.log("TODO: send vote");
        	var votes = {};
        	for (projectId in self.projects) {
        		project = self.projects[projectId];
        		if (project.vote) {
        			votes[project._id] = project.vote;
        		}
        	}
        	captcha_response = grecaptcha.getResponse();
        	if (!captcha_response) {
        		/*alert("You need to enter the captcha");
        		return;*/
        	} 
        	votes["captcha"] = captcha_response;
        	votes["action"] = "save_votes";
        	votes["event_name"] = self.eventID;
        	WebsocketService.send_votes(votes);
        }

        $scope.$parent.$parent.nextButtonText = "Send Vote";
        $scope.$parent.$parent.nextButtonPress = self.sendVote;

        if (typeof grecaptcha !== 'undefined') {
        	grecaptcha.render('captcha', {
          		'sitekey' : "6LcasSITAAAAAJqb7Xdc07vYn-jdTaThwX2RIVSY"
        	});
        }
       
    }
});