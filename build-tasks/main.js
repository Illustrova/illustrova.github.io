import gulp from 'gulp'

import {
  compileScripts,
  lintScripts,
  watchScripts,
} from './scripts'

import {
  compileStyles,
  lintStyles,
  watchStyles,
} from './styles'

import {
  compileMarkup,
  compileAjaxSources,
  watchMarkup,
  watchAjaxSources
} from './markup'

import { processImages, getImagesData, watchImages, } from './images'

const lint = gulp.parallel(lintStyles, lintScripts)
lint.description = 'lint all source'

const compile = gulp.parallel(
  compileMarkup,
  compileAjaxSources,
  compileStyles,
  compileScripts,
  gulp.series(processImages, getImagesData)
)
compile.description = 'compile all source'

const watch = gulp.parallel(watchMarkup, watchAjaxSources, watchStyles, watchScripts, watchImages)
watch.description = 'watch for changes to all source'

export {
  compile,
  lint,
  watch,
}