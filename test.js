const { before, after, describe, it } = require('kocha')
const { expect } = require('chai')
const { execSync } = require('child_process')
const { readFileSync } = require('fs')
const { join } = require('path')
const rimraf = require('rimraf')

before(done => {
  rimraf('examples/*/build', done)
})

after(done => {
  rimraf('examples/*/build', done)
})

describe('remarker', () => {
  it('creates index.html from slides.md', () => {
    execSync('node ../../index.js build', {
      cwd: join(__dirname, 'examples/simple')
    })

    expect(readFileSync(join(__dirname, 'examples/simple/build/index.html')).toString()).to.include('My Awesome Presentation')
  })

  it('reads remarker.yml if it exists in cwd', () => {
    execSync('node ../../index.js build', {
      cwd: join(__dirname, 'examples/remark')
    })

    expect(readFileSync(join(__dirname, 'examples/remark/build/index.html')).toString()).to.include('@import url(https://fonts.googleapis.com/css?family=Droid+Serif);')
  })
})
