import gulp from 'gulp';
import gConfig from '../gulp-config';
import { getEnv } from './utils';
import pluginLoader from 'gulp-load-plugins';

const opts = gConfig.pluginOpts;
const env = getEnv();
const src = gConfig.paths.sources;
const dest = gConfig.paths.destinations;
const plugins = pluginLoader(opts.load);

var realFavicon = require('gulp-real-favicon');
var fs = require('fs');

// File where the favicon markups are stored
var FAVICON_DATA_FILE = 'faviconData.json';

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
// gulp.task('generate-favicon', function(done) {
const generateFavicon = done => {
	opts['real-favicon'] = Object.assign({}, opts['real-favicon'], {
		masterPicture: src.favicon,
		dest: dest.favicon,
		iconsPath: 'assets/favicon',
		markupFile: FAVICON_DATA_FILE,
	});
	return realFavicon.generateFavicon(opts['real-favicon'], function() {
		done();
	});
};
generateFavicon.description = `Generate the icons`;

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
const injectFaviconMarkup = () => {
	return gulp
		.src(['public/*.html'])
		.pipe(
			realFavicon.injectFaviconMarkups(
				JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code
			)
		)
		.pipe(gulp.dest('public'));
};
injectFaviconMarkup.description = `Inject the favicon markups in HTML pages`;

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
const checkFaviconUpdate = () => {
	var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
	realFavicon.checkForUpdates(currentVersion, function(err) {
		if (err) {
			throw err;
		}
	});
};

checkFaviconUpdate.description = `Check for updates on RealFaviconGenerator`;

export { generateFavicon, injectFaviconMarkup, checkFaviconUpdate };
