import gulp from 'gulp'
import gConfig from '../gulp-config'
import { getEnv } from './utils'
import pluginLoader from 'gulp-load-plugins'
const fs = require('fs')
const path = require('path')

const opts = gConfig.pluginOpts
const env = getEnv()
const src = gConfig.paths.sources
const dest = gConfig.paths.destinations
const plugins = pluginLoader(opts.load)

const glob = require('glob')
var sizeOf = require('image-size')

const processImages = () => {
  /* safe renaming of filenames to avoid special chars and uppercase */
  const imgRename = function(path) {
    path.basename = path.basename.toLowerCase()
    path.basename = path.basename.replace(
      /[\s!=&\/\\#,+()$~%.'":*?<>{}@]/g,
      '-'
    )
    return path
  }
  return gulp
    .src(src.images)
    .pipe(plugins.plumber())
    .pipe(plugins.rename(imgRename)) // Rename task has to go before changed, otherwise unneded files kept in pipeline
    .pipe(env.deploy ? noop() : plugins.changed(dest.images))
    .pipe(
      plugins.responsive(opts.responsive.breakpoints, opts.responsive.global)
    )
    .pipe(gulp.dest(dest.images))
}

processImages.description = `Resize images to multiple sizes, cleanup filenames and minify`
processImages.flags = {
  '--deploy': `Process all images`,
}

const getImagesData = done => {
  let files = glob.sync(dest.images + '/**/*.!(svg)')
  let json = JSON.stringify(
    {
      images: files.reduce((json, value) => {
        let filepath = path.normalize(value)
        let dimensions = sizeOf(filepath)
        json[path.basename(filepath, path.extname(filepath))] = {
          path: "'" + filepath.toLowerCase() + "'",
          width: dimensions.width,
          height: dimensions.height,
        }
        return json
      }, {}),
    },
    null,
    '\t'
  )
  done()
  return fs.writeFileSync(src.data.images, json)
}

/* TODO: populate watching task */
const watchImages = () =>
  gulp.watch(src.images, gulp.series(processImages, getImagesData))
/* TODO: watch description */
watchImages.description = `Watch changes of images and process on change`

export { processImages, getImagesData, watchImages }
