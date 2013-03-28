$(function () {
	$.cookie.defaults.expires = 365;
	$.cookie.json = true;

	var defaultSettings = {
		startWeight: [45,45,45,45,45],
		previousWeight: [200,200,200,200,200],
		weightIncrease: [5,5,5,5,5],
		onebyfivemultiplier: [25,25,25,25,25],
		onebythreemultiplier: [50,50,50,50,50],
		onebytwomultiplier: [75,75,75,75,75]
	};
	var settings = defaultSettings;
	if($.cookie('ssCalcSettings')) {
		settings = $.extend(defaultSettings, $.cookie('ssCalcSettings'));
	}

	function ssCalcViewModel() {
		var self = this;

		self.lifts = ko.observableArray([
			{ name: 'Squat', value: 0 },
			{ name: 'Overhead Press', value: 1 },
			{ name: 'Bench Press', value: 2 },
			{ name: 'Deadlift', value: 3 },
			{ name: 'Power Clean', value: 4 }
		]);
		self.showSettings = ko.observable(false);

		self.selectedLift = ko.observable();
		self.startWeight = ko.observable(settings.startWeight[0]);
		self.previousWeight = ko.observable(settings.previousWeight[0]);
		self.weightIncrease = ko.observable(settings.weightIncrease[0]);
		self.onebyfivemultiplier = ko.observable(settings.onebyfivemultiplier[0]);
		self.onebythreemultiplier = ko.observable(settings.onebythreemultiplier[0]);
		self.onebytwomultiplier = ko.observable(settings.onebytwomultiplier[0]);
		
		self.workWeight = ko.computed(function () {
			return parseFloat(self.previousWeight()) + parseFloat(self.weightIncrease());
		});
		self.onebyfive = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), self.onebyfivemultiplier());
		});
		self.onebythree = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), self.onebythreemultiplier());
		});
		self.onebytwo = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), self.onebytwomultiplier());
		});

		self.selectedLift.subscribe(function(newValue) {
			self.startWeight(settings.startWeight[newValue.value]);
			self.previousWeight(settings.previousWeight[newValue.value]);
			self.weightIncrease(settings.weightIncrease[newValue.value]);
			self.onebyfivemultiplier(settings.onebyfivemultiplier[newValue.value]);
			self.onebythreemultiplier(settings.onebythreemultiplier[newValue.value]);
			self.onebytwomultiplier(settings.onebytwomultiplier[newValue.value]);
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
		self.onebyfivemultiplier.subscribe(function() {
			settings.onebyfivemultiplier[self.selectedLift().value] = self.onebyfivemultiplier();
			$.cookie('ssCalcSettings', settings);
		});
		self.onebythreemultiplier.subscribe(function() {
			settings.onebythreemultiplier[self.selectedLift().value] = self.onebythreemultiplier();
			$.cookie('ssCalcSettings', settings);
		});
		self.onebytwomultiplier.subscribe(function() {
			settings.onebytwomultiplier[self.selectedLift().value] = self.onebytwomultiplier();
			$.cookie('ssCalcSettings', settings);
		});
	}
	ko.applyBindings(new ssCalcViewModel());

	function calculateWarmupWeight(startWeight, workWeight, multiplier) {
		startWeight = parseFloat(startWeight);
		workWeight = parseFloat(workWeight);
		multiplier = parseFloat(multiplier);
		return Math.floor((workWeight - startWeight) * (multiplier / 100) / 5) * 5 + startWeight;
	}
});
// Warmup Set Formula = ((Work Weight - Starting Weight) x Multiplier) + Starting Weight