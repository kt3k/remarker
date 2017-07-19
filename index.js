const berber = require('berber')

berber.name('remarker')

berber.on('config', config => {
  config = config || {}
  berber.asset(config.source || 'slides.md')
})
