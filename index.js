const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const _debounce = require('lodash.debounce');
const chalk = require('chalk');
const gulpIf = require('gulp-if');
const chokidar = require('chokidar');
const _merge = require('lodash.merge');
const sourcemaps = require('gulp-sourcemaps');

const PLUGIN_NAME = 'Eleventy-Plugin-Babel';
const PLUGIN_SHORT = 'PB';
const defaultOptions = {
  watch: ['**/*.js', '!node_modules/**'],
  outputDir: 'dist/js',
  babel: {
    presets: ['@babel/env'],
  },
  uglify: false,
  sourceMaps: false,
};

const compileJS = _debounce(function (eleventyInstance, options) {
  console.log(`[${chalk.yellow(PLUGIN_NAME)}] Compiling JS files...`);
  gulp
    .src(options.watch)
    .pipe(gulpIf(options.sourceMaps, sourcemaps.init()))
    .pipe(babel(options.babel))
    .pipe(gulpIf(options.sourceMaps, sourcemaps.write('.')))
    .pipe(gulpIf(options.uglify, uglify()))
    .pipe(gulp.dest(options.outputDir || eleventyInstance.outputDir))
    .on('end', function (test) {
      console.log(`[${chalk.yellow(PLUGIN_NAME)}] Done compiling JS files.`);
      eleventyInstance.eleventyServe.reload();
    });
}, 500);

function initializeWatcher(eleventyInstance, options) {
  const watcher = chokidar.watch(options.watch, {
    persistent: true,
  });
  watcher
    .on('add', (path) => {
      compileJS(eleventyInstance, options);
    })
    .on('change', (path) => {
      compileJS(eleventyInstance, options);
    });
}

function monkeypatch(cls, fn) {
  const orig = cls.prototype[fn.name][`_${PLUGIN_SHORT}_original`] || cls.prototype[fn.name];
  function wrapped() {
    return fn.bind(this, orig).apply(this, arguments);
  }
  wrapped[`_${PLUGIN_SHORT}_original`] = orig;

  cls.prototype[fn.name] = wrapped;
}

module.exports = {
  initArguments: {},
  configFunction: function (eleventyConfig, options) {
    setImmediate(function () {
      options = _merge(defaultOptions, options);
      let initialized = false;
      const Eleventy = require('@11ty/eleventy/src/Eleventy.js');
      if (Eleventy.prototype) {
        function write(original) {
          if (!initialized && !this.isDryRun) {
            compileJS(this, options);
          }
          return original.apply(this);
        }
        function watch(original) {
          if (!initialized) {
            initializeWatcher(this, options);
            initialized = true;
          }
          return original.apply(this);
        }
        function serve(original, port) {
          if (!initialized) {
            initializeWatcher(this, options);
            initialized = true;
          }
          return original.apply(this, [port]);
        }
        monkeypatch(Eleventy, write);
        monkeypatch(Eleventy, watch);
        monkeypatch(Eleventy, serve);
      }
    });
  },
};
