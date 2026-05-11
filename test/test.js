'use strict';

const assert = require('node:assert').strict;
const path = require('node:path');
const { suite } = require('uvu');
const resolvePath = require('../index.js');

const test = suite('resolve-dependency-path');
const multiPeriod = suite('multiple period filenames');
const implicitPlugins = suite('implicit jspm/systemjs style plugins');
const explicitPlugins = suite('explicit jspm/systemjs style plugins');
const webpackSupport = suite('webpack support');

test('throws if the dependency path is missing', () => {
  assert.throws(() => {
    resolvePath();
  }, /^Error: dependency path not given$/);
});

test('throws if the filename is missing', () => {
  assert.throws(() => {
    resolvePath({ dependency: './bar' });
  }, /^Error: filename not given$/);
});

test('throws if the directory is missing', () => {
  assert.throws(() => {
    resolvePath({
      dependency: './bar',
      filename: path.join(__dirname, '/foo.js')
    });
  }, /^Error: directory not given$/);
});

test('resolves with absolute paths', () => {
  const dependency = './bar';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  assert.equal(resolved.startsWith(directory), true);
});

test('resolves w/initial period, w/ending in .js', () => {
  const dependency = './index';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  const expected = path.join(directory, '/index.js');
  assert.equal(resolved, expected);
});

test('resolves w/initial period, w/o ending in .js', () => {
  const dependency = './index.js';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  const expected = path.join(directory, '/index.js');
  assert.equal(resolved, expected);
});

test('resolves w/o initial period, w/o ending in .js', () => {
  const dependency = 'index';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  const expected = path.join(directory, '/index.js');
  assert.equal(resolved, expected);
});

test('resolves w/o initial period, w/ending in .js', () => {
  const dependency = 'index.js';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  const expected = path.join(directory, '/index.js');
  assert.equal(resolved, expected);
});

test('resolves relative paths', () => {
  const dependency = './bar.js';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  const expected = path.join(directory, '/bar.js');
  assert.equal(resolved, expected);
});

test('resolves non-relative paths', () => {
  const dependency = 'feature2/bar';
  const directory = __dirname;
  const filename = path.join(directory, '/feature1/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  const expected = path.join(directory, '/feature2/bar.js');
  assert.equal(resolved, expected);
});

multiPeriod('resolves with multiple periods in the dependency path', () => {
  const dependency = './bar.baz.qux';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  const expected = path.join(directory, '/bar.baz.qux.js');
  assert.equal(resolved, expected);
});

multiPeriod('does not duplicate extensions', () => {
  const dependency = '../index.js';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  // Extension after removing the .js extension
  const remainingExt = path.extname(path.basename(resolved, '.js'));
  assert.equal(remainingExt, '');
});

multiPeriod('does not add the incorrect extension for sass files', () => {
  const dependency = 'styles';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.scss');
  const resolved = resolvePath({ dependency, filename, directory });
  assert.equal(path.extname(resolved), '.scss');
});

multiPeriod('does not add the incorrect extension for mustache files', () => {
  const dependency = 'hgn!templates/foo.mustache';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  assert.equal(path.extname(resolved), '.mustache');
});

implicitPlugins('resolve w/initial period', () => {
  const dependency = './templates/file.css!';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  assert.equal(path.extname(resolved), '.css');
});

implicitPlugins('resolve w/o initial period', () => {
  const dependency = 'templates/file.css!';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  assert.equal(path.extname(resolved), '.css');
});

explicitPlugins('resolve w/initial period', () => {
  const dependency = './templates/file.txt!text';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  assert.equal(path.extname(resolved), '.txt');
});

explicitPlugins('resolve w/o initial period', () => {
  const dependency = 'templates/file.txt!text';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  assert.equal(path.extname(resolved), '.txt');
});

webpackSupport.skip('resolves properly', () => {
  const dependency = './styles/foo.css';
  const directory = __dirname;
  const filename = path.join(directory, '/foo.js');
  const resolved = resolvePath({ dependency, filename, directory });
  assert.equal(path.extname(resolved), '.css');
});

test.run();
multiPeriod.run();
implicitPlugins.run();
explicitPlugins.run();
webpackSupport.run();
