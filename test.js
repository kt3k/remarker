const { before, after, describe, it } = require('kocha')
const { expect } = require('chai')
const { execSync } = require('child_process')
const { readFileSync, existsSync } = require('fs')
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

  it('replaces stylesheets by remarker.yml\'s css property', () => {
    execSync('node ../../index.js build', {
      cwd: join(__dirname, 'examples/remark')
    })

    expect(readFileSync(join(__dirname, 'examples/remark/build/index.html')).toString()).to.include('@import url(https://fonts.googleapis.com/css?family=Droid+Serif);')
  })

  it('replaces remark.js by remarker.yml\'s remarkPath', () => {
    execSync('node ../../index.js build', {
      cwd: join(__dirname, 'examples/replace-remark')
    })

    expect(readFileSync(join(__dirname, 'examples/replace-remark/build/remark.js')).toString()).to.include('console.log("remark.js")')
  })

  it('injects scripts by remarker.yml\'s script', () => {
    execSync('node ../../index.js build', {
      cwd: join(__dirname, 'examples/replace-remark')
    })

    expect(readFileSync(join(__dirname, 'examples/replace-remark/build/index.html')).toString()).to.include('console.log("injected script")')
  })

  describe('-s, --source option', () => {
    it('specifies the slide\'s markdown path', () => {
      execSync('node ../../index.js build --source my-slides.md', {
        cwd: join(__dirname, 'examples/simple')
      })

      expect(readFileSync(join(__dirname, 'examples/simple/build/index.html')).toString()).to.include('This is my-slides.md')

      execSync('node ../../index.js build -s my-slides-2.md', {
        cwd: join(__dirname, 'examples/simple')
      })

      expect(readFileSync(join(__dirname, 'examples/simple/build/index.html')).toString()).to.include('This is my-slides-2.md')
    })
  })

  describe('file asset entry', () => {
    it('builds the given file to build dir', () => {
      execSync('node ../../index.js build', {
        cwd: join(__dirname, 'examples/favicon')
      })

      expect(existsSync('examples/favicon/build/favicon.ico')).to.equal(true)
    })
  })
})
