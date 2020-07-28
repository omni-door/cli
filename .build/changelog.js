const standardVersion = require('standard-version');

standardVersion({
  infile: 'docs/CHANGELOG.AUTO.md',
  skip: true
}).catch(err => {
  console.error(`auto change-log failed: ${err.message}`)
})