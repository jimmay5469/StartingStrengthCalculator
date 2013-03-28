$(function () {
	function ssCalcViewModel() {
		var self = this;
		self.helloWorld = ko.observable();
		
		self.helloWorld('Hello World');
	}
	
	ko.applyBindings(new ssCalcViewModel());
});