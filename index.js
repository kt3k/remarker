#!/usr/bin/env node

const {
  asset,
  dest,
  name,
  on,
  port,
  debugPagePath,
  helpMessage,
  loggerTitle,
  addMiddleware
} = require('berber')
const layout1 = require('layout1')
const rename = require('gulp-rename')
const { readFileSync, existsSync, statSync } = require('fs')
const { join } = require('path')
const minimisted = require('minimisted')

var transform = require('vinyl-transform')
var map = require('map-stream')
var emoji = require('node-emoji')

require('require-yaml')

const emojify = () =>
  transform(filename =>
    map((chunk, next) => next(null, emoji.emojify(chunk.toString())))
  )

const read = path => readFileSync(join(__dirname, path)).toString()

const layoutFilename = join(__dirname, 'layout.njk')

const defaultCss = read('assets/default.css')

const defaultAssetsPath = 'assets'

const defaultConfig = {
  title: '', // The page title of the result html
  port: 6275, // The port number of dev server
  livereload: true,
  livereloadPort: 35729,
  dest: 'build', // The destination directory of built assets
  out: 'index.html', // The result html filename of the slides
  source: 'slides.md', // The source of the slides
  css: defaultCss, // The additional css for the slides
  cssFiles: [], // The additional css files
  script: '', // The additional script for the slides
  scriptFiles: [], // The additional script files
  remarkConfig: {}, // The config object passed to remark
  remarkPath: join(__dirname, 'vendor', 'remark.js'), // The remark path
  assets: [defaultAssetsPath] // The asset paths
}

name('remarker')
debugPagePath('__remarker__')
loggerTitle('remarker')
helpMessage(read('assets/help-message.txt'))

const onConfig = (config, argv) => {
  config = Object.assign({}, defaultConfig, config, argv)

  port(config.port)
  dest(config.dest)

  const cssFiles = !Array.isArray(config.cssFiles)
    ? Array(config.cssFiles)
    : config.cssFiles
  const scriptFiles = !Array.isArray(config.scriptFiles)
    ? Array(config.scriptFiles)
    : config.scriptFiles

  const slidePipeline = asset(config.source)
    .pipe(emojify())
    .pipe(rename(config.out))
    .pipe(
      layout1.nunjucks(layoutFilename, {
        data: {
          css: config.css,
          cssFiles: cssFiles,
          script: config.script,
          scriptFiles: scriptFiles,
          title: config.title,
          remarkConfig: config.remarkConfig,
          livereloadPort: config.livereloadPort
        }
      })
    )

  // livereload settings
  if (config.livereload) {
    on('serve', () => onLivereloadConfig(slidePipeline, config))
  }

  asset(config.remarkPath).pipe(rename('remark.js'))

  cssFiles.filter(src => !/^http/.test(src)).forEach(src => {
    asset(src).base(process.cwd())
  })

  scriptFiles.filter(src => !/^http/.test(src)).forEach(src => {
    asset(src).base(process.cwd())
  })

  config.assets.forEach(src => {
    if (existsSync(src)) {
      const stat = statSync(src)

      if (stat.isDirectory()) {
        asset(join(src, '**/*.*')).base(process.cwd())
      } else if (stat.isFile()) {
        asset(src).base(process.cwd())
      } else {
        console.log(
          `Warning: asset entry '${src}' has unknown type, skipping this entry`
        )
      }
    } else if (src === defaultAssetsPath) {
      // do nothing, ignore silently
    } else {
      console.log(
        `Warning: asset entry '${src}' not found, skipping this entry`
      )
    }
  })
}

const livereloadScriptMiddleware = (req, res, next) => {
  if (require('url').parse(req.url).pathname !== '/livereload.js') {
    next()
    return
  }

  const livereloadScript = read('vendor/livereload.js')

  res.setHeader('Content-Type', 'text/javascript')
  res.end(livereloadScript)
}

const onLivereloadConfig = (slidePipeline, config) => {
  const livereload = require('connect-livereload')
  const gulplivereload = require('gulp-livereload')

  const port = config.livereloadPort

  addMiddleware(() => livereload({ port, src: '/livereload.js' }))

  addMiddleware(() => livereloadScriptMiddleware)

  gulplivereload.listen({ port })
  slidePipeline.pipe(gulplivereload({ port }))
}

on('config', config =>
  minimisted(argv => onConfig(config, argv), {
    string: ['source', 'out', 'dest', 'port'],
    alias: {
      s: 'source',
      o: 'out',
      p: 'port',
      d: 'dest'
    }
  })
)
