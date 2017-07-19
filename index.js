#!/usr/bin/env node

const { asset, name, on } = require('berber')
const layout1 = require('layout1')
const rename = require('gulp-rename')
const { readFileSync } = require('fs')
const { join } = require('path')
require('require-yaml')

const script = readFileSync(join(__dirname, 'vendor/remark.js'))
const layoutFilename = join(__dirname, 'layout.njk')

const defaultCss = `
  body {
    font-family: 'Avenir Next', 'Hiragino Kaku Gothic ProN', 'Meiryo', 'メイリオ', sans-serif;
  }
  h1, h2, h3 {
    font-weight: normal;
  }
  .remark-code,
  .remark-inline-code {
    font-family: 'Menlo', 'Monaco', 'Courier new', monospace;
  }
`

name('remarker')

on('config', config => {
  config = config || {}

  asset(config.source || 'slides.md')
    .pipe(rename({ basename: 'index', extname: '.html' }))
    .pipe(layout1.nunjucks(layoutFilename, {
      data: {
        script,
        css: config.css || defaultCss,
        title: config.title || ''
      }
    }))
})
