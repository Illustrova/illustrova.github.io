import gulp from "gulp";
import gConfig from "../gulp-config";
import { getEnv } from "./utils";
import pluginLoader from "gulp-load-plugins";
import { obj as noop } from "through2";

const opts = gConfig.pluginOpts;
const env = getEnv();
const src = gConfig.paths.sources;
const dest = gConfig.paths.destinations;
const plugins = pluginLoader(opts.load);

import { injectFaviconMarkup } from "./favicon";

const compileMarkup = () => {
	opts.pug = Object.assign({}, opts.pug, {
		pretty: !(env.deploy && opts.pug.pretty),
		data: Object.assign({}, opts.pug.data, {
			scriptName: `${opts.pug.data.name}${env.deploy ? ".min" : ""}`,
			styleName: `${opts.pug.data.name}${env.deploy ? ".min" : ""}`,
		}),
	});
	// Don't do anything if outputting dist files and using compilation task
	if (env.dist) return gulp.src(src.docs).pipe(noop());
	return gulp
		.src(src.docs)
		.pipe(plugins.plumber())
		.pipe(plugins.pug(opts.pug))
		.pipe(gulp.dest(dest.html));
};
compileMarkup.description = `compile markup source(${src.markup.all}) using pug`;
compileMarkup.flags = {
	"--deploy":
		"Turns off pretty option in pug and removes whitespace from output",
};

const watchMarkup = () =>
	gulp.watch(src.markup.all, gulp.series(compileMarkup, injectFaviconMarkup));
watchMarkup.description = `watch for changes in markup source(${src.markup.all}) compile on change`;

const compileAjaxSources = done => {
	opts.pug.data.ajax.forEach(function(project) {
		let options = Object.assign({}, opts.pug, {
			pretty: !(env.deploy && opts.pug.pretty),
			data: Object.assign({ project: project }, opts.pug.data, {
				scriptName: `${opts.pug.data.name}${env.deploy ? ".min" : ""}`,
				styleName: `${opts.pug.data.name}${env.deploy ? ".min" : ""}`,
			}),
		});
		gulp
			.src(src.markup.ajax)
			.pipe(plugins.pug(options))
			.pipe(
				plugins.rename(
					`projects/${project.title.replace(/\s+/g, "-").toLowerCase()}.html`
				)
			)
			.pipe(gulp.dest(dest.html));
	});
	done();
};

compileAjaxSources.description = `compile markup sources for ajax (${src.markup.ajax}) in loop for project data using pug`;
compileAjaxSources.flags = {
	"--deploy":
		"Turns off pretty option in pug and removes whitespace from output",
};

const watchAjaxSources = () =>
	gulp.watch(src.markup.ajax, gulp.series(compileAjaxSources));
watchAjaxSources.description = `watch for changes in markup source(${src.markup.all}) compile on change`;

export { compileMarkup, watchMarkup, compileAjaxSources, watchAjaxSources };
