import fullpage from 'fullpage.js';
import vars from '../../data/variables.json';

export function setupFullpage(element) {
	$(element).fullpage({
		autoScrolling: true,
		scrollBar: true,
		fitToSection: true,
		scrollOverflow: false,
		verticalCentered: false,
		normalScrollElements: '.modal-open .modal',
		navigation: true,
		navigationPosition: 'right',
		navigationTooltips: ['Portfolio', 'About', 'Contact'],
		responsiveWidth: vars.breakpoints.m,
		responsiveHeight: 550, //TODO: calculate maximum heighth of content dynamically
		// Dot nav decorative classes
		onLeave: function(origin, destination, direction) {
			if (direction && direction == 'down') {
				$('#fp-nav li a')
					.slice(0, destination.index)
					.each(function(i) {
						let self = $(this);
						setTimeout(function() {
							self.addClass('before-active');
						}, i * vars.dotNavTransitionDuration);
					});
			} else if (direction && direction == 'up') {
				$(
					$('#fp-nav li a')
						.get()
						.slice(destination.index)
						.reverse()
				).each(function(i) {
					let self = $(this);
					setTimeout(function() {
						self.removeClass('before-active');
					}, i * vars.dotNavTransitionDuration);
				});
			}
		},
	});
}
