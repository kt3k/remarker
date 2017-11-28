#!/usr/bin/env node

const { asset, dest, name, on, port, debugPagePath } = require('berber')
const layout1 = require('layout1')
const rename = require('gulp-rename')
const { readFileSync } = require('fs')
const { join } = require('path')

require('require-yaml')

const layoutFilename = join(__dirname, 'layout.njk')

const defaultCss = `
  body {
    font-family: 'Avenir Next', 'Hiragino Kaku Gothic ProN', 'Meiryo', 'メイリオ', sans-serif;
  }
  h1, h2, h3 {
    font-weight: bold;
  }
  .remark-code,
  .remark-inline-code {
    font-family: 'Menlo', 'Monaco', 'Courier new', monospace;
  }

  .remark-slide-content.inverse {
    color: #f3f3f3;
    background-color: #272822;
  }
`

const defaultConfig = {
  title: '',
  port: 6275,
  dest: 'build',
  source: 'slides.md',
  css: defaultCss,
  remarkConfig: {},
  remarkPath: join(__dirname, 'vendor', 'remark.js'),
  assets: ['assets']
}

name('remarker')

on('config', config => {
  config = Object.assign({}, defaultConfig, config)

  port(config.port)
  dest(config.dest)

  asset(config.source)
    .pipe(rename({ basename: 'index', extname: '.html' }))
    .pipe(layout1.nunjucks(layoutFilename, {
      data: {
        css: config.css,
        title: config.title,
        remarkConfig: config.remarkConfig
      }
    }))

  asset(config.remarkPath)
    .pipe(rename('remark.js'))

  config.assets.forEach(src => {
    asset(join(src, '**/*.*')).base(process.cwd())
  })
})

debugPagePath('__remarker__')
