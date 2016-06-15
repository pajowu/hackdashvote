angular.module('eventList', ['ngRoute', 'DataFactory'])
.component('eventList', ["DataFactory"], function (DataFactory) {
	return {
    templateUrl: 'app/event-list/event-list.template.html',
    controller: function EventListController(DataFactory) {
        var self = this;
        DataFactory.get_events();
        self.events = DataFactory.events;
    }
}});