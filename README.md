# remarker v1.1.0

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

This starts a local server at port 6275 (this is configurable) and you can see your slides at [http://localhost:6275/](http://localhost:6275/).

See remark's [slide](https://remarkjs.com/) and [documentation](https://github.com/gnab/remark#remark) for more details about its syntax, features etc.

## Build slides

You can build your slides as static page as `remarker build` command.

```console
$ ./node_modules/.bin/remarker build
```

This builds your slides as html page under `build/` directory. The output directory is configurable. See the below for details.

# Configuration

You can configure remarker with configuration file called `remarker.yml`:

Default settings are as follows:

```yml
port: 6275
dest: build
source: slides.md
title: ''
css: ''
```

- `port` is the port number of remarker server. Default is `6275`.
- `dest` is the destination of `remarker build` command. Default is `build`
- `source` is the source markdown filename. Default is `slides.md`.
- `title` is the page title of the slides. Default is an empty string.
- `css` is css text you want to add to slides' html page.

# Examples

- [simple example](https://github.com/kt3k/remarker/tree/master/examples/simple)
- [remark slides](https://github.com/kt3k/remarker/tree/master/examples/remark)
  - The original `remark` slides in `remarker` configuration.

# License

MIT

[remark]: https://github.com/gnab/remark
