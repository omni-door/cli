export default function (config: {
  srcDir: string;
  outDir: string;
  esmDir: string;
}) {
  const { srcDir = 'src', outDir = 'lib', esmDir = 'es' } = config;

  return `'use strict';

const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const less = require('gulp-less');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const through2 = require('through2');

const params = {
  dest: {
    lib: path.resolve('${outDir}'),
    es: path.resolve('${esmDir}')
  },
  styles: '${srcDir}/components/**/*.{less,scss,sass}',
  scripts: [
    '${srcDir}/components/**/*.{ts,tsx,js,jsx}',
    '!${srcDir}/components/**/{demo,__demo__,test,__test__,stories,__stories__}/*.{ts,tsx,js,jsx}'
  ]
};

function cssInjection (content) {
  return content
    .replace(/\/style\/?'/g, "/style/css'")
    .replace(/\/style\/?"/g, '/style/css"')
    .replace(/\.(less|scss|sass)/g, '.css');
}

function compileScripts (babelEnv, destDir) {
  const { scripts } = params;
  process.env.BABEL_ENV = babelEnv;
  return gulp
    .src(scripts)
    .pipe(babel({
      configFile: path.resolve(process.cwd(), 'babel.config.js')
    }))
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone());
        if (file.path.match(/(\/|\\)style(\/|\\)index\.js/)) {
          const content = file.contents.toString(encoding);
          file.contents = Buffer.from(cssInjection(content));
          file.path = file.path.replace(/index\.js/, 'css.js');
          this.push(file);
          next();
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest(destDir));
}

function compileCJS () {
  const { dest } = params;
  return compileScripts('cjs', dest.lib);
}

function compileES () {
  const { dest } = params;
  return compileScripts('es', dest.es);
}

function copyStylesheet () {
  const { dest, styles } = params;
  return gulp
    .src(styles)
    .pipe(gulp.dest(dest.lib))
    .pipe(gulp.dest(dest.es));
}

function trans2css() {
  const { dest, styles } = params;
  return gulp
    .src(styles)
    .pipe(less())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssnano({ zindex: false, reduceIdents: false }))
    .pipe(gulp.dest(dest.lib))
    .pipe(gulp.dest(dest.es));
}

const buildScripts = gulp.series(compileCJS, compileES);

const build = gulp.parallel(buildScripts, copyStylesheet, trans2css);

exports.build = build;

exports.default = build;
`;
}