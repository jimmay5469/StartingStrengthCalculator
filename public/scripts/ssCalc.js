$(function () {
	function ssCalcViewModel() {
		var self = this;

		self.startWeight = ko.observable(45);
		self.workWeight = ko.observable(135);

		self.onebyfive = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.25);
		});
		self.onebythree = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.5);
		});
		self.onebytwo = ko.computed(function() {
			return calculateWarmupWeight(self.startWeight(), self.workWeight(), 0.75);
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