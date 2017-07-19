# remarker v0.1.0

> Remark cli

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

This starts a local server at port 6275 (this is configurable) and you can see your slide at [http://localhost:6275/](http://localhost:6275/).

See remark's [slide](https://remarkjs.com/) and [documentation](https://github.com/gnab/remark#remark) for more details about its syntax, features etc.

## Build slides

You can build your slide as static page as `remarker build` command.

```console
$ ./node_modules/.bin/remarker build
```

This builds your slide as html page under `build/` directory. The output directory is configurable. See the below for details.

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

# License

MIT
