import 'mixitup/dist/mixitup.js';
import '../vendor/mxt-pagination';
import vars from '../../data/variables.json';

/**
 * Calculate number of columns optimal for current layout
 *
 * @param {object} breakpoints - collection of breakpoints used in project, defined in variables.json
 * @param {object} columns - collection of columns number, corresponding to breakpoints, defined in variables.json
 * @param {number} windowWidth - normally window.innerWidth is used
 * @returns {number} number of columns for layout
 */
function getColumns(breakpoints, columns, windowWidth) {
	var prev = '';
	for (var i in breakpoints) {
		if (!columns[i]) {
			continue;
		}
		var n = parseInt(breakpoints[i]);
		if (prev != '' && windowWidth < n) {
			return columns[prev];
		} else {
			prev = i;
		}
	}
	// If nothing matched, return maximum value
	return columns[prev];
}

/**
 * Calculate number of items per page needed to fill mixer layout nicely
 *
 * @returns {number} items per page
 */
function getItemsPerPage() {
	let containerH = document.querySelector('.portfolio-container').offsetHeight;
	let itemH = document.querySelector('.portfolio-item').offsetHeight;

	let rows = Math.floor(containerH / itemH);
	let columns = getColumns(vars.breakpoints, vars.columns, window.innerWidth);

	return rows * columns;
}

let Portfolio = function(element) {
	this.element = element;
	this.setupMixer();
	this.setupListeners();
};

Portfolio.prototype.setupMixer = function() {
	this.mixer = mixitup(this.element, {
		pagination: {
			limit: getItemsPerPage(),
			hidePageListIfSinglePage: true,
			maintainActivePage: false,
			maxPagers: 10,
		},
		animation: {
			clampHeight: false,
			clampWidth: false,
			animateResizeContainer: false, // required to prevent column algorithm bug
		},
		classNames: {
			block: '',
			elementPager: '', // keep it empty to match bootstrap naming
		},
		selectors: {
			control: '.mxt-control',
		},
		callbacks: {
			// On each change of filters write current set to global variable,
			// in order to provide access for modal  component
			onMixEnd: function(state) {
				window.portfolioShown = state.matching;
			},
		},
		templates: {
			pager:
				'<li class="page-item ${classNames}"><a class="page-link rounded-circle  mxt-control" href="#" data-page="${pageNumber}">${pageNumber}</a></li>',
			pagerPrev:
				'<li class="page-item ${classNames}"><a class="page-link rounded-circle  mxt-control" href="#" data-page="prev" aria-label="Previous">' +
				'<span aria-hidden="true">&#10229;</span>' +
				'<span class="sr-only">Previous</span>' +
				'</a></li>',
			pagerNext:
				'<li class="page-item ${classNames}"><a class="page-link rounded-circle mxt-control" href="#" aria-label="Next" data-page="next">' +
				'<span aria-hidden="true">&#10230;</span>' +
				'<span class="sr-only">Next</span>' +
				'</a></li>',
		},
	});
};

Portfolio.prototype.setupListeners = function() {
	let self = this;
	$(window).resize(function() {
		clearTimeout(window.resizedFinished);
		window.resizedFinished = setTimeout(function() {
			self.mixer.paginate({
				limit: getItemsPerPage(),
			});
		}, 250);
	});
};

export default Portfolio;
