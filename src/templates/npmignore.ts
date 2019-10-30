export default function () {
  return `.idea
.DS_Store
*~
~*

build
src
*test*
node_modules
.omni_cache

# config files
.eslintignore
.eslintrc.js
.gitignore
*.config.js
*.conf.js
tsconfig.json

_config.yml
.nyc_output
.travis.yml
coverage
.nycrc
mocha.opts

yarn.lock
package-lock.json

# log files
*.log
*.log.*`;
}