/* eslint-env mocha */

'use strict';

const assert = require('assert').strict;
const path = require('path');
const resolvePath = require('../index.js');

describe('resolve-dependency-path', () => {
  it('resolves with absolute paths', () => {
    const resolved = resolvePath({
      dependency: './bar',
      filename: path.join(__dirname, '/foo.js'),
      directory: __dirname
    });
    assert.ok(resolved.startsWith(__dirname));
  });

  it('resolves w/initial period, w/ending in .js', () => {
    const depPath = './index';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency: depPath,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/index.js');
    assert.equal(resolved, expected);
  });

  it('resolves w/initial period, w/o ending in .js', () => {
    const depPath = './index.js';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency: depPath,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/index.js');
    assert.equal(resolved, expected);
  });

  it('resolves w/o initial period, w/o ending in .js', () => {
    const depPath = 'index';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency: depPath,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/index.js');
    assert.equal(resolved, expected);
  });

  it('resolves w/o initial period, w/ending in .js', () => {
    const depPath = 'index.js';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency: depPath,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/index.js');
    assert.equal(resolved, expected);
  });

  it('resolves relative paths', () => {
    const resolved = resolvePath({
      dependency: './bar',
      filename: path.join(__dirname, '/foo.js'),
      directory: __dirname
    });
    const expected = path.join(__dirname, '/bar.js');
    assert.equal(resolved, expected);
  });

  it('resolves non-relative paths', () => {
    const filename = path.join(__dirname, '/feature1/foo.js');
    const resolved = resolvePath({
      dependency: 'feature2/bar',
      filename,
      directory: __dirname
    });
    const expected = path.join(__dirname, '/feature2/bar.js');
    assert.equal(resolved, expected);
  });

  it('throws if the dependency path is missing', () => {
    assert.throws(() => {
      resolvePath();
    });
  });

  it('throws if the filename is missing', () => {
    assert.throws(() => {
      resolvePath({
        dependency: './bar'
      });
    });
  });

  it('throws if the directory is missing', () => {
    assert.throws(() => {
      resolvePath({
        dependency: './bar',
        filename: path.join(__dirname, '/foo.js')
      });
    });
  });

  describe('multiple period filenames', () => {
    it('resolves with multiple periods in the dependency path', () => {
      const depPath = './bar.baz.qux';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      const expected = path.join(__dirname, '/bar.baz.qux.js');
      assert.equal(resolved, expected);
    });

    it('does not duplicate extensions', () => {
      const depPath = '../index.js';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      // Extension after removing the .js extension
      const remainingExt = path.extname(path.basename(resolved, '.js'));
      assert.equal(remainingExt, '');
    });

    it('does not add the incorrect extension for sass files', () => {
      const depPath = 'styles';
      const filename = path.join(__dirname, '/foo.scss');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.scss');
    });

    it('does not add the incorrect extension for mustache files', () => {
      const depPath = 'hgn!templates/foo.mustache';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.mustache');
    });
  });

  describe('implicit jspm/systemjs style plugins', () => {
    it('resolve w/initial period', () => {
      const depPath = './templates/file.css!';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.css');
    });

    it('resolve w/o initial period', () => {
      const depPath = 'templates/file.css!';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.css');
    });
  });

  describe('explicit jspm/systemjs style plugins', () => {
    it('resolve w/initial period', () => {
      const depPath = './templates/file.txt!text';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.txt');
    });

    it('resolve w/o initial period', () => {
      const depPath = 'templates/file.txt!text';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.txt');
    });
  });

  describe('webpack support', () => {
    it.skip('resolves properly', () => {
      const depPath = './styles/foo.css';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency: depPath,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.css');
    });
  });
});
