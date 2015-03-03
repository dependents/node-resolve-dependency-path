var path = require('path');
var amdLookup = require('module-lookup-amd');

/**
 * Resolve a dependency's path
 *
 * @param  {Object} options
 * @param  {String} options.path - The dependency path to resolve
 * @param  {String} options.filename - Filename that contains the dependency
 * @param  {String} options.directory - Root of all files
 * @param  {String} options.requireConfig - RequireJS configuration path
 *
 * @return {String} Absolute/resolved path of the dependency
 */
module.exports = function(options) {
  var dep = options.path;
  var filename = options.filename;
  var directory = options.directory;
  var requireConfig = options.requireConfig;

  if (!dep) { throw new Error('dependency path not given'); }
  if (!filename) { throw new Error('filename not given'); }
  if (!directory) { throw new Error('directory not given'); }

  // RequireJS
  if (requireConfig) {
    dep = amdLookup(requireConfig, dep);

  // SystemJS
  } else if (path.extname(dep).indexOf('!') !== -1) {
    dep = systemJSLookup(dep);
  }

  // TODO: Sass lookup

  var filepath = getDependencyPath(dep, filename, directory);

  return findFileLike(filepath);
}

/**
 * SystemJS logic for resolving a loader-specific path
 * @param  {String} dep
 * @return {String}
 */
function systemJSLookup(dep) {
  var depExt = path.extname(dep);
  return dep.substring(0, depExt.indexOf('!'));
}

/**
 * @param  {String}  dep
 * @return {Boolean}
 */
function isRelative(dep) {
  return dep.indexOf('..') === 0 || dep.indexOf('.') === 0;
}

/**
 * @param  {String} dep
 * @param  {String} filename
 * @param  {String} directory
 * @return {String} Absolute path for the dependency
 */
function getDependencyPath(dep, filename, directory) {
  if (isRelative(dep)) {
    return path.resolve(path.dirname(filename), dep);
  }

  return path.resolve(directory, dep);
}

/**
 * @param  {String} dep
 * @param  {String} filename
 * @return {String} The determined extension for the dependency (or empty if already supplied)
 */
function getDependencyExtension(dep, filename) {
  var depExt = path.extname(dep);
  var fileExt = path.extname(filename);

  if (!depExt) {
    return fileExt;
  }

  // If a dependency starts with a period AND it doesn't already end
  // in .js AND doesn't use a custom plugin, add .js back to path
  if (fileExt === '.js' && depExt !== '.js' && dep.indexOf('!') < 0) {
    return fileExt;
  }

  // If using a SystemJS style plugin
  if (depExt.indexOf('!') > -1) {
    return depExt.substring(0, depExt.indexOf('!'));
  }

  return '';
}

// TODO: Move to module
var execSync = require('sync-exec');
var isWin = /^win/.test(process.platform);
/**
 * Find the file that matches/completes the given path
 * @param  {[type]} filepath [description]
 * @return {[type]}          [description]
 */
function findFileLike(filepath) {
  var cmd = [isWin ? 'dir' : 'ls', filepath + '*'].join(' ');

  var out = execSync(cmd);
  var lines = out.stdout.split('\n');
  return lines[0];
}
