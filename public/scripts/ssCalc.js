$(function () {
	$.cookie.defaults.expires = 365;
	$.cookie.json = true;

	var defaultSettings = {
		startWeight: [45,45,45,45,45],
		previousWeight: [200,200,200,200,200],
		weightIncrease: [5,5,5,5,5]
	};
	var settings = defaultSettings;
	if($.cookie('ssCalcSettings')) {
		settings = $.extend(defaultSettings, $.cookie('ssCalcSettings'));
	}

	function ssCalcViewModel() {
		var self = this;

		self.Lifts = ko.observableArray([
			{ name: 'Squat', value: 0 },
			{ name: 'Overhead Press', value: 1 },
			{ name: 'Bench Press', value: 2 },
			{ name: 'Deadlift', value: 3 },
			{ name: 'Power Clean', value: 4 }
		]);

		self.selectedLift = ko.observable();
		self.startWeight = ko.observable(settings.startWeight[0]);
		self.previousWeight = ko.observable(settings.previousWeight[0]);
		self.weightIncrease = ko.observable(settings.weightIncrease[0]);
		
		self.workWeight = ko.computed(function () {
			return parseFloat(self.previousWeight()) + parseFloat(self.weightIncrease());
		});
		self.onebyfive = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.25);
		});
		self.onebythree = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.5);
		});
		self.onebytwo = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.75);
		});

		self.selectedLift.subscribe(function(newValue) {
			self.startWeight(settings.startWeight[newValue.value]);
			self.previousWeight(settings.previousWeight[newValue.value]);
			self.weightIncrease(settings.weightIncrease[newValue.value]);
		});

		self.startWeight.subscribe(function() {
			settings.startWeight[self.selectedLift().value] = self.startWeight();
			$.cookie('ssCalcSettings', settings);
		});
		self.previousWeight.subscribe(function() {
			settings.previousWeight[self.selectedLift().value] = self.previousWeight();
			$.cookie('ssCalcSettings', settings);
		});
		self.weightIncrease.subscribe(function() {
			settings.weightIncrease[self.selectedLift().value] = self.weightIncrease();
			$.cookie('ssCalcSettings', settings);
		});
	}
	ko.applyBindings(new ssCalcViewModel());

	function calculateWarmupWeight(startWeight, workWeight, multiplier) {
		startWeight = parseFloat(startWeight);
		workWeight = parseFloat(workWeight);
		multiplier = parseFloat(multiplier);
		return Math.floor((workWeight - startWeight) * multiplier / 5) * 5 + startWeight;
	}
});
// Warmup Set Formula = ((Work Weight - Starting Weight) x Multiplier) + Starting Weight