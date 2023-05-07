'use strict';

const path = require('path');

/**
 * @param  {Object} options
 * @param  {String} options.dependency - The dependency name to resolve
 * @param  {String} options.filename - Filename that contains the dependency
 * @param  {String} options.directory - Root of all files
 * @return {String} Absolute/resolved path of the dependency
 */
module.exports = function({ dependency: dep, filename, directory } = {}) {
  if (!dep) throw new Error('dependency path not given');
  if (!filename) throw new Error('filename not given');
  if (!directory) throw new Error('directory not given');

  const filepath = getDependencyPath(dep, filename, directory);
  const ext = getDependencyExtension(dep, filename);

  return filepath + ext;
};

/**
 * @param  {String} dep
 * @param  {String} filename
 * @param  {String} directory
 * @return {String} Absolute path for the dependency
 */
function getDependencyPath(dep, filename, directory) {
  if (dep.indexOf('..') === 0 || dep.indexOf('.') === 0) {
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
  const depExt = path.extname(dep);
  const fileExt = path.extname(filename);

  if (!depExt) {
    return fileExt;
  }

  // If a dependency starts with a period AND it doesn't already end
  // in .js AND doesn't use a custom plugin, add .js back to path
  if (fileExt === '.js' && depExt !== '.js' && !dep.includes('!')) {
    return fileExt;
  }

  // If using a SystemJS style plugin
  if (depExt.includes('!')) {
    return depExt.substring(0, depExt.indexOf('!'));
  }

  return '';
}
