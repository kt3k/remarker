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

require('require-yaml')

const read = path => readFileSync(join(__dirname, path)).toString()

const layoutFilename = join(__dirname, 'layout.njk')

const defaultCss = read('assets/default.css')

const defaultAssetsPath = 'assets'

const defaultConfig = {
  title: '',
  port: 6275,
  livereload: true,
  livereloadPort: 35729,
  dest: 'build',
  source: 'slides.md',
  css: defaultCss,
  cssFiles: [],
  script: '',
  scriptFiles: [],
  remarkConfig: {},
  remarkPath: join(__dirname, 'vendor', 'remark.js'),
  assets: [defaultAssetsPath]
}

name('remarker')
debugPagePath('__remarker__')
loggerTitle('remarker')
helpMessage(read('assets/help-message.txt'))

on('config', config =>
  minimisted(
    argv => {
      config = Object.assign({}, defaultConfig, config, argv)

      port(config.port)
      dest(config.dest)

      const slidePipeline = asset(config.source)
        .pipe(rename({ basename: 'index', extname: '.html' }))
        .pipe(
          layout1.nunjucks(layoutFilename, {
            data: {
              css: config.css,
              cssFiles: config.cssFiles
                .map(url => `<link href="${url}" rel="stylesheet" />`)
                .join('\n'),
              script: config.script,
              scriptFiles: config.scriptFiles
                .map(url => `<script src="${url}"></script>`)
                .join('\n'),
              title: config.title,
              remarkConfig: config.remarkConfig,
              livereloadPort: config.livereloadPort
            }
          })
        )

      // livereload settings
      if (config.livereload) {
        on('serve', () => {
          const livereload = require('connect-livereload')
          const gulplivereload = require('gulp-livereload')
          const livereloadScript = readFileSync(
            join(__dirname, 'vendor', 'livereload.js')
          )

          const port = config.livereloadPort

          addMiddleware(() => livereload({ port, src: '/livereload.js' }))

          addMiddleware(() => (req, res, next) => {
            if (require('url').parse(req.url).pathname === '/livereload.js') {
              res.setHeader('Content-Type', 'text/javascript')
              res.end(livereloadScript)
            }
            next()
          })

          gulplivereload.listen({ port })
          slidePipeline.pipe(gulplivereload({ port }))
        })
      }

      asset(config.remarkPath).pipe(rename('remark.js'))

      config.cssFiles.forEach(src => {
        if (/^http/.test(src)) {
          return
        }
        asset(src).base(process.cwd())
      })

      config.scriptFiles.forEach(src => {
        if (/^http/.test(src)) {
          return
        }
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
    },
    {
      string: ['source'],
      alias: {
        s: 'source'
      }
    }
  )
)
