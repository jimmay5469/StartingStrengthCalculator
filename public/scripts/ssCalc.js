$(function () {
	$.cookie.defaults.expires = 365;
	$.cookie.json = true;

	var defaultSettings = {
		startWeight: 45,
		workWeight: 135
	};
	
	var settings = defaultSettings;
	if($.cookie('ssCalcSettings')) {
		settings = $.extend(defaultSettings, $.cookie('ssCalcSettings'));
	}

	function ssCalcViewModel() {
		var self = this;

		self.startWeight = ko.observable(settings.startWeight);
		self.workWeight = ko.observable(settings.workWeight);

		self.onebyfive = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.25);
		});
		self.onebythree = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.5);
		});
		self.onebytwo = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.75);
		});

		self.startWeight.subscribe(persistSettings);
		self.workWeight.subscribe(persistSettings);
		function persistSettings() {
			var newSettings = {
				startWeight: self.startWeight(),
				workWeight: self.workWeight()
			}
			$.cookie('ssCalcSettings', newSettings);
		}
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