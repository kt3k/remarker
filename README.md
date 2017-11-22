# remarker v1.3.0

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
assets: ['assets']
title: ''
css: ''
remarkConfig: {}
```

- `port` is the port number of remarker server. Default is `6275`.
- `dest` is the destination of `remarker build` command. Default is `build`
- `source` is the source markdown filename. Default is `slides.md`.
- `assets` is the list of assets directory. These directories are copied/served statically.
- `title` is the page title of the slides. Default is an empty string.
- `css` is css text you want to add to slides' html page.
- `remarkConfig` is the config object which is passed to remark.create(options). Default is an empty object.
  - See [the remark source code](https://github.com/gnab/remark/blob/develop/src/remark/models/slideshow.js#L41-L48) for what option is available.

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

- 2017-08-05   v1.3.0   Add remarkConfig prop.

# License

MIT

[remark]: https://github.com/gnab/remark
