var assert = require('assert');
var resolvePath = require('../');
var path = require('path');

describe('resolve-dependency-path', function() {
  var directory = __dirname + '/example';

  it('resolves with absolute paths', function() {
    var resolved = resolvePath({
      path: './bar',
      filename: directory + '/foo.js',
      directory: directory
    });

    assert(resolved.indexOf(__dirname) === 0);
  });

  it('resolves w/initial period, w/ending in .js', function() {
    var depPath = './index';
    var filename = directory + '/foo.js';
    var resolved = resolvePath({
      path: depPath,
      filename: filename,
      directory: directory
    });

    assert.equal(resolved, directory + '/index.js');
  });

  it('resolves w/initial period, w/o ending in .js', function() {
    var depPath = './index.js';
    var filename = directory + '/foo.js';
    var resolved = resolvePath({
      path: depPath,
      filename: filename,
      directory: directory
    });

    assert.equal(resolved, directory + '/index.js');
  });

  it('resolves w/o initial period, w/o ending in .js', function() {
    var depPath = 'index';
    var filename = directory + '/foo.js';
    var resolved = resolvePath({
      path: depPath,
      filename: filename,
      directory: directory
    });

    assert.equal(resolved, directory + '/index.js');
  });

  it('resolves w/o initial period, w/ending in .js', function() {
    var depPath = 'index.js';
    var filename = directory + '/foo.js';
    var resolved = resolvePath({
      path: depPath,
      filename: filename,
      directory: directory
    });

    assert.equal(resolved, directory + '/index.js');
  });

  it('resolves relative paths', function() {
    var resolved = resolvePath({
      path: './bar',
      filename: directory + '/foo.js',
      directory: directory
    });

    assert.equal(resolved, directory + '/bar.js');
  });

  it('resolves non-relative paths', function() {
    var resolved = resolvePath({
      path: 'feature2/bar',
      filename: directory + '/feature1/foo.js',
      directory: directory
    });

    assert.equal(resolved, directory + '/feature2/bar.js');
  });

  it('throws if the dependency path is missing', function() {
    assert.throws(function() {
      resolvePath();
    });
  });

  it('throws if the filename is missing', function() {
    assert.throws(function() {
      resolvePath({
        path: './bar'
      });
    });
  });

  it('throws if the directory is missing', function() {
    assert.throws(function() {
      resolvePath({
        path: './bar',
        filename: directory + '/foo.js'
      });
    });
  });

  describe('multiple period filenames', function() {
    it('resolves with multiple periods in the dependency path', function() {
      var depPath = './bar.baz.qux';
      var _directory = directory + '/multidot';
      var filename = _directory + '/foo.js';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: _directory
      });

      assert.equal(resolved, _directory + '/bar.baz.qux.js');
    });

    it('does not duplicate extensions', function() {
      var depPath = '../index.js';
      var directory = directory + '/feature1';
      var filename = directory + '/foo.js';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: directory
      });
      // Extension after removing the .js extension
      var remainingExt = path.extname(path.basename(resolved, '.js'));

      assert.equal(remainingExt, '');
    });

    it('does not add the incorrect extension for sass files', function() {
      var depPath = 'styles';
      var _directory = directory + '/sass';
      var filename = _directory + '/foo.scss';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: _directory
      });

      assert.equal(path.extname(resolved), '.scss');
    });

    it('does not add the incorrect extension for mustache files', function() {
      var depPath = 'templates/a.mustache';
      var filename = directory + '/foo.js';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: directory
      });

      assert.equal(path.extname(resolved), '.mustache');
    });
  });

  describe('implicit jspm/systemjs style plugins', function() {
    it('resolve w/initial period', function() {
      var depPath = './styles/file.css!';
      var filename = directory + '/foo.js';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: directory
      });

      assert.equal(path.extname(resolved), '.css');
    });

    it('resolve w/o initial period', function() {
      var depPath = 'styles/file.css!';
      var filename = directory + '/foo.js';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: directory
      });

      assert.equal(path.extname(resolved), '.css');
    });
  });

  describe('explicit jspm/systemjs style plugins', function() {
    it('resolve w/initial period', function() {
      var depPath = './assets/file.txt!text';
      var filename = directory + '/foo.js';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: directory
      });

      assert.equal(path.extname(resolved), '.txt');
    });

    it('resolve w/o initial period', function() {
      var depPath = 'assets/file.txt!text';
      var filename = directory + '/foo.js';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: directory
      });

      assert.equal(path.extname(resolved), '.txt');
    });
  });

  describe('webpack support', function() {
    it('resolves properly', function() {
      var depPath = './styles/foo.css';
      var filename = directory + '/foo.js';
      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: directory
      });

      assert.equal(path.extname(resolved), '.css');
    });
  });

  describe('requirejs configuration', function() {
    var _directory = directory + '/requirejs';

    it('resolves aliases', function() {
      var depPath = 'foobar';
      var filename = _directory + '/foo.js';

      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: _directory,
        requireConfig: _directory + '/config.js'
      });

      assert.equal(resolved, _directory + '/b.js');
    });

    it('resolves loaders', function() {
      var depPath = 'hgn!templates/a';
      var filename = _directory + '/foo.js';

      var resolved = resolvePath({
        path: depPath,
        filename: filename,
        directory: _directory,
        requireConfig: _directory + '/config.js'
      });

      assert.equal(resolved, _directory + '/templates/a.mustache');
    });
  });
});
