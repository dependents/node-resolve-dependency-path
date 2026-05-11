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
export default function resolveDependencyPath({ dependency, filename, directory }?: {
    dependency: string;
    filename: string;
    directory: string;
}): string;
