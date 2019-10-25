export default function () {
  return `.idea
.DS_Store
*~
~*

build
src
*test*
node_modules

# config files
.eslintignore
.eslintrc.js
.gitignore
babel.config.js
commitlint.config.js
jest.config.js
stylelint.config.js
bisheng.config.js
karma.conf.js
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
*.log.*
`;
}