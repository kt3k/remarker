const { before, after, describe, it, context, timeout } = require('kocha')
const { expect } = require('chai')
const { spawn, execSync } = require('child_process')
const { readFileSync, existsSync } = require('fs')
const { join } = require('path')
const rimraf = require('rimraf')
const touch = require('touch')
const WebSocket = require('ws')
const axios = require('axios')

const examples = {
  simple: join(__dirname, 'examples/simple'),
  replaceRemark: join(__dirname, 'examples/replace-remark'),
  hasAssets: join(__dirname, 'examples/has-assets'),
  favicon: join(__dirname, 'examples/favicon'),
  remark: join(__dirname, 'examples/remark'),
  addScripts: join(__dirname, 'examples/add-scripts')
}

const processes = []

before(done => {
  rimraf('examples/*/build', done)
})

after(done => {
  processes.forEach(child => child.kill())
  rimraf('examples/*/build', done)
})

describe('remarker', () => {
  it('creates index.html from slides.md', () => {
    execSync('node ../../index.js build', { cwd: examples.simple })

    expect(
      readFileSync(join(examples.simple, 'build', 'index.html')).toString()
    ).to.include('My Awesome Presentation')
  })

  it("replaces stylesheets by remarker.yml's css property", () => {
    execSync('node ../../index.js build', { cwd: examples.remark })

    expect(
      readFileSync(join(examples.remark, 'build', 'index.html')).toString()
    ).to.include(
      '@import url(https://fonts.googleapis.com/css?family=Droid+Serif);'
    )
  })

  it("replaces remark.js by remarker.yml's remarkPath", () => {
    execSync('node ../../index.js build', { cwd: examples.replaceRemark })

    expect(
      readFileSync(
        join(examples.replaceRemark, 'build', 'remark.js')
      ).toString()
    ).to.include('console.log("remark.js")')
  })

  it("injects scripts by remarker.yml's script", () => {
    execSync('node ../../index.js build', {
      cwd: examples.replaceRemark
    })

    expect(
      readFileSync(
        join(examples.replaceRemark, 'build', 'index.html')
      ).toString()
    ).to.include('console.log("injected script")')
  })

  describe('-s, --source option', () => {
    it("specifies the slide's markdown path", () => {
      execSync('node ../../index.js build --source my-slides.md', {
        cwd: examples.simple
      })

      expect(
        readFileSync(join(examples.simple, 'build', 'index.html')).toString()
      ).to.include('This is my-slides.md')

      execSync('node ../../index.js build -s my-slides-2.md', {
        cwd: examples.simple
      })

      expect(
        readFileSync(join(examples.simple, 'build', 'index.html')).toString()
      ).to.include('This is my-slides-2.md')
    })
  })

  describe('contents in assets directory', () => {
    it('are copied to build directory', () => {
      execSync('node ../../index.js build', { cwd: examples.hasAssets })

      expect(existsSync('examples/has-assets/build/assets/degu.png')).to.equal(
        true
      )
    })
  })

  describe('file asset entry', () => {
    it('builds the given file to build dir', () => {
      execSync('node ../../index.js build', { cwd: examples.favicon })

      expect(existsSync('examples/favicon/build/favicon.ico')).to.equal(true)
    })
  })

  describe('scriptFiles option', () => {
    it('adds script files', () => {
      execSync('node ../../index.js build', { cwd: examples.addScripts })

      const html = readFileSync(
        join(examples.addScripts, 'build', 'index.html')
      ).toString()

      expect(html).to.include('baz.js')
      expect(html).to.include('qux.js')
    })
  })

  describe('cssFiles option', () => {
    it('adds css files', () => {
      execSync('node ../../index.js build', { cwd: examples.addScripts })

      const html = readFileSync(
        join(examples.addScripts, 'build', 'index.html')
      ).toString()

      expect(html).to.include('foo.css')
      expect(html).to.include('bar.css')
    })
  })

  context('when serving', () => {
    it('starts livereload server by default', done => {
      timeout(8000)
      const child = spawn('node', ['../../index.js'], { cwd: examples.remark })

      processes.push(child)

      setTimeout(() => {
        const ws = new WebSocket('http://localhost:35729/livereload')

        ws.on('message', data => {
          expect(JSON.parse(data).command).to.equal('reload')

          child.kill()

          done()
        })

        touch(join(examples.remark, 'slides.md'))
      }, 2000)
    })

    it('responses livereload.js at /livereload.js', done => {
      timeout(8000)
      const child = spawn('node', ['../../index.js'], { cwd: examples.remark })

      processes.push(child)

      setTimeout(() => {
        axios.get('http://localhost:6275/index.html')
        axios.get('http://localhost:6275/livereload.js').then(res => {
          expect(res.data).to.include('livereload')

          done()
        })
      }, 2000)
    })
  })
})
