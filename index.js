import path from 'node:path';

/**
 * Resolve a dependency specifier to an absolute file path.
 *
 * @param  {object} options
 * @param  {string} options.dependency - The dependency specifier (e.g. `'./bar'` or `'lodash'`)
 * @param  {string} options.filename   - Absolute or relative path of the file that contains the dependency
 * @param  {string} options.directory  - Root directory used to resolve non-relative dependencies
 * @returns {string} Resolved absolute path including the inferred file extension
 * @throws {Error} When any of the required options is missing or falsy
 */
export default function resolveDependencyPath({ dependency, filename, directory } = {}) {
  if (!dependency) throw new Error('dependency path not given');
  if (!filename) throw new Error('filename not given');
  if (!directory) throw new Error('directory not given');

  const filepath = getDependencyPath(dependency, filename, directory);
  const extension = getDependencyExtension(dependency, filename);

  return filepath + extension;
}

/**
 * @param  {string} dependency
 * @param  {string} filename
 * @param  {string} directory
 * @returns {string}
 */
function getDependencyPath(dependency, filename, directory) {
  if (dependency.startsWith('..') || dependency.startsWith('.')) {
    return path.resolve(path.dirname(filename), dependency);
  }

  return path.resolve(directory, dependency);
}

/**
 * Returns the file extension to append to the resolved path.
 * Returns an empty string when the dependency already has a final extension.
 *
 * @param  {string} dependency
 * @param  {string} filename
 * @returns {string}
 */
function getDependencyExtension(dependency, filename) {
  const dependencyExtension = path.extname(dependency);
  const fileExtension = path.extname(filename);

  if (!dependencyExtension) {
    return fileExtension;
  }

  // If a dependency starts with a period AND it doesn't already end
  // in .js AND doesn't use a custom plugin, add .js back to path
  if (fileExtension === '.js' && dependencyExtension !== '.js' && !dependency.includes('!')) {
    return fileExtension;
  }

  // If using a SystemJS style plugin
  if (dependencyExtension.includes('!')) {
    return dependencyExtension.slice(0, dependencyExtension.indexOf('!'));
  }

  return '';
}
