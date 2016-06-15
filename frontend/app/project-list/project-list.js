angular.module('projectList', ['ngRoute', 'DataFactory']) .component('projectList', {
    templateUrl: 'app/project-list/project-list.template.html',
    controller: function ProjectListController(DataFactory) {
        var self = this;
        DataFactory.get_projects(event);
        self.projects = DataFactory.projects;
    }
});