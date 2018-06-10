# remarker v1.8.1

[![CircleCI](https://circleci.com/gh/kt3k/remarker.svg?style=svg)](https://circleci.com/gh/kt3k/remarker)
[![codecov](https://codecov.io/gh/kt3k/remarker/branch/master/graph/badge.svg)](https://codecov.io/gh/kt3k/remarker)

> [Remark][remark] cli

[remark][remark] is a simple, in-browser, markdown-driven slideshow tool. `remarker` is a command line tool for building a remark-based slideshow page very easily.

# Usage

Install via npm:

```console
$ npm install --save remarker
```

Write your slide in markdown:

```md
# My Slide

---

# My Slide 2

???

Presenter notes here

---
```

save the above as `slides.md`

Invoke `remarker` command.

```console
$ ./node_modules/.bin/remarker
```

Or if you have `npx` command, then hit:

```console
$ npx remarker
```

This starts a local server at port 6275 (this is configurable) and you can see your slides at [http://localhost:6275/](http://localhost:6275/).

See remark's [slide](https://remarkjs.com/) and [documentation](https://github.com/gnab/remark#remark) for more details about its syntax, features etc.

## Build slides

You can build your slides as static page as `remarker build` command.

```console
$ ./node_modules/.bin/remarker build
```

This builds your slides as html page under `build/` directory. The output directory is configurable. See the below for details.

## Installing globally

You can instead install it globally, in one of these two ways:

```bash
sudo npm i -g remarker    # from the npm repository
sudo npm i -g .           # if there's a clone in the current directory
```

After that, you should be able to invoke it this way from any directory in your system:

```bash
remarker [build]
```

# Configuration

You can configure remarker with configuration file called `remarker.yml`:

Default settings are as follows:

```yml
port: 6275
dest: build
source: slides.md
title: ''
assets: ['assets']
css: ''
cssFiles: []
script: ''
scriptFiles: []
remarkConfig: {}
remarkPath: moduleDir + '/vendor/remark.js'
livereload: true
livereloadPort: 35729
```

## Basic options

- `port` is the port number of remarker server. Default is `6275`.
- `dest` is the destination of `remarker build` command. Default is `build`
- `source` is the source markdown filename. Default is `slides.md`.
- `title` is the page title of the slides. Default is an empty string.
- `css` is css text you want to add to slides' html page.
- `cssFiles` is the list of additional stylesheet files (URL or the file path relative to your current working director) you want to add to slides' html page. If you provide file paths, these files are copied/served statically. Default is an empty array.

## Advanced options

- `assets` is the list of assets directory. These directories are copied/served statically.
- `scriptFiles` is the list of additional JavaScript files (URL or the file path relative to your current working director) appended after the remark.js. If you provide file paths, these files are copied/served statically. Default is an empty array.
- `script` is additional JavaScript code appended after the remark.js and `scriptFiles`. Default is an empty string.
- `remarkConfig` is the config object which is passed to remark.create(options). Default is an empty object.
  - See [the remark source code](https://github.com/gnab/remark/blob/develop/src/remark/models/slideshow.js#L41-L48) for what option is available.
- `remarkPath` is the path to remark.js. This replaces the original remark.js with specified one.
- `livereload` is the flag to toggle livereloading feature. Default is true.
- `livereloadPort` is the port number for livereloading websocket connection. Default is 35729.

## CLI Usage

```
Usage:
  remarker [options] serve      Serves all the assets at localhost
  remarker [options] build      Builds all the assets to the dest

Options:
  -h, --help                    Shows the help message and exits
  -v, --version                 Shows the version number and exits
  -s, --source <path>           Specifies the slide's markdown file.
                                This overrides 'source' property of the config file.
```

# Examples

- [simple example](https://github.com/kt3k/remarker/tree/master/examples/simple)
- [remark slides](https://github.com/kt3k/remarker/tree/master/examples/remark)
  - The original `remark` slides in `remarker` configuration.

# Motivation of `remarker`

`remark` is a great presentation tool and you can write your slide's contents in markdown. The problem is when you simply use ramark, you need to maintain the html, css and scripts as well as markdown. If you care the details of design and style of the slides, that's fine. However if you don't care the design of the slides that much and want to focus only on the contents, then the settings of css, html, scripts seem quite messy. `remarker` solves this problem. `remarker` separates the contents (= markdown) from the settings (css, html, scripts). So you can only focus on and keep maintaining the contents of the slides and let `remarker` do the rest of the work. This is easier than using `remark` directly.

# How-tos

## How to use images in slides

Put the images under `./assets` directory and they are automatically served/copied and you can reference it like `<img src="assets/my-diagram.png" width="600" />` in your slides.

The directory name of `assets` can be configured in `remarker.yml`. See the configuration section for details.

# History

- 2018-06-10   v1.8.1   Fixed help and version options.
- 2018-06-10   v1.8.0   Added livereloading feature.
- 2018-01-29   v1.7.0   Enabled file asset (#8).
- 2018-01-13   v1.6.1   Fixed -s option.
- 2018-01-12   v1.6.0   Added --source cli option.
- 2017-08-05   v1.3.0   Added remarkConfig prop.

# License

MIT

# Star History

[![Stargazers over time](https://starcharts.herokuapp.com/kt3k/remarker.svg)](https://starcharts.herokuapp.com/kt3k/remarker)

[remark]: https://github.com/gnab/remark
