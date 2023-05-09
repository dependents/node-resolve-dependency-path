/* eslint-env mocha */

'use strict';

const assert = require('assert').strict;
const path = require('path');
const resolvePath = require('../index.js');

describe('resolve-dependency-path', () => {
  it('throws if the dependency path is missing', () => {
    assert.throws(() => {
      resolvePath();
    }, /^Error: dependency path not given$/);
  });

  it('throws if the filename is missing', () => {
    assert.throws(() => {
      resolvePath({
        dependency: './bar'
      });
    }, /^Error: filename not given$/);
  });

  it('throws if the directory is missing', () => {
    assert.throws(() => {
      resolvePath({
        dependency: './bar',
        filename: path.join(__dirname, '/foo.js')
      });
    }, /^Error: directory not given$/);
  });

  it('resolves with absolute paths', () => {
    const dependency = './bar';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency,
      filename,
      directory
    });
    assert.ok(resolved.startsWith(__dirname));
  });

  it('resolves w/initial period, w/ending in .js', () => {
    const dependency = './index';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/index.js');
    assert.equal(resolved, expected);
  });

  it('resolves w/initial period, w/o ending in .js', () => {
    const dependency = './index.js';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/index.js');
    assert.equal(resolved, expected);
  });

  it('resolves w/o initial period, w/o ending in .js', () => {
    const dependency = 'index';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/index.js');
    assert.equal(resolved, expected);
  });

  it('resolves w/o initial period, w/ending in .js', () => {
    const dependency = 'index.js';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/index.js');
    assert.equal(resolved, expected);
  });

  it('resolves relative paths', () => {
    const dependency = './bar.js';
    const filename = path.join(__dirname, '/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/bar.js');
    assert.equal(resolved, expected);
  });

  it('resolves non-relative paths', () => {
    const dependency = 'feature2/bar';
    const filename = path.join(__dirname, '/feature1/foo.js');
    const directory = __dirname;
    const resolved = resolvePath({
      dependency,
      filename,
      directory
    });
    const expected = path.join(__dirname, '/feature2/bar.js');
    assert.equal(resolved, expected);
  });

  describe('multiple period filenames', () => {
    it('resolves with multiple periods in the dependency path', () => {
      const dependency = './bar.baz.qux';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      const expected = path.join(__dirname, '/bar.baz.qux.js');
      assert.equal(resolved, expected);
    });

    it('does not duplicate extensions', () => {
      const dependency = '../index.js';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      // Extension after removing the .js extension
      const remainingExt = path.extname(path.basename(resolved, '.js'));
      assert.equal(remainingExt, '');
    });

    it('does not add the incorrect extension for sass files', () => {
      const dependency = 'styles';
      const filename = path.join(__dirname, '/foo.scss');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.scss');
    });

    it('does not add the incorrect extension for mustache files', () => {
      const dependency = 'hgn!templates/foo.mustache';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.mustache');
    });
  });

  describe('implicit jspm/systemjs style plugins', () => {
    it('resolve w/initial period', () => {
      const dependency = './templates/file.css!';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.css');
    });

    it('resolve w/o initial period', () => {
      const dependency = 'templates/file.css!';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.css');
    });
  });

  describe('explicit jspm/systemjs style plugins', () => {
    it('resolve w/initial period', () => {
      const dependency = './templates/file.txt!text';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.txt');
    });

    it('resolve w/o initial period', () => {
      const dependency = 'templates/file.txt!text';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.txt');
    });
  });

  describe('webpack support', () => {
    it.skip('resolves properly', () => {
      const dependency = './styles/foo.css';
      const filename = path.join(__dirname, '/foo.js');
      const directory = __dirname;
      const resolved = resolvePath({
        dependency,
        filename,
        directory
      });
      assert.equal(path.extname(resolved), '.css');
    });
  });
});
