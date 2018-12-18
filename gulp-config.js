import { getEnv } from './build-tasks/utils'

const envVar = getEnv()
const env = envVar.dist ? 'dist/' : 'public/'
const pkg = require('./package.json')
const siteConfig = require('./src/data/config.json')
const vars = require('./src/data/variables.json')
const img = require('./src/data/images.json')
const content = require('./src/data/content.json')
var jsonImporter = require('node-sass-json-importer')

module.exports = {
  pkg: {
    name: pkg.name,
  },
  pluginOpts: {
    browserSync: {
      port: 1987,
      server: {
        baseDir: env,
      },
    },
    gSize: {
      showFiles: true,
    },
    pug: {
      pretty: true,
      data: {
        config: siteConfig,
        vars: vars,
        img: img,
        content: content,
        ajax: content.portfolio,
        description: pkg.description,
        name: pkg.name,
        version: pkg.version,
      },
    },
    sass: {
      outputStyle: 'expand',
      importer: jsonImporter(),
    },
    load: {
      rename: {
        'gulp-gh-pages': 'deploy',
        'gulp-cssnano': 'minify',
        'gulp-autoprefixer': 'prefix',
      },
    },
    prefix: ['last 3 versions', 'Blackberry 10', 'Android 3', 'Android 4'],
    rename: {
      suffix: '.min',
    },
    stylint: {
      reporter: 'stylint-stylish',
    },
    responsive: {
      global: {
        quality: 70,
        progressive: true,
        withMetadata: false,
        withoutEnlargement: true,
        skipOnEnlargement: false,
        errorOnEnlargement: false,
        silent: true,
        stats: true,
        errorOnUnusedImage: false,
        errorOnUnusedConfig: false,
      },
      breakpoints: {
        '**': Object.values(vars.breakpoints)
          .concat([vars.defaultImageWidth])
          .map(bp => ({
            width: bp,
            height:
              (bp / vars.defaultAspectRatio.width) *
              vars.defaultAspectRatio.height,
            crop: 'centre',
            rename: bp === vars.defaultImageWidth ? null : { suffix: `_${bp}` },
          })),
      },
    },
  },
  paths: {
    base: env,
    sources: {
      docs: 'src/pug/*.pug',
      markup: {
        all: ['src/pug/**/*.pug', '!src/pug/ajax/**/*.pug'],
        ajax: 'src/pug/ajax/**/*.pug',
      },
      overwatch: env + '**/*.{html,js,css}',
      scripts: {
        root: 'src/js/scripts.js',
        all: 'src/js/**/*.js',
      },
      styles: {
        root: 'src/scss/main.scss',
        all: 'src/scss/**/*.scss',
      },
      images: 'src/assets/img/**/*.!(svg|gif)',
      data: {
        images: 'src/data/images.json',
      },
    },
    destinations: {
      css: env + 'css/',
      html: env,
      js: env + 'js/',
      images: env + 'assets/img',
    },
  },
}
