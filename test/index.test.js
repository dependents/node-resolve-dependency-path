import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import resolvePath from '../index.js';

const directory = fileURLToPath(new URL('.', import.meta.url));

describe('resolve-dependency-path', () => {
  it('throws if the dependency path is missing', () => {
    expect(() => {
      resolvePath();
    }).toThrow(new Error('dependency path not given'));
  });

  it('throws if the filename is missing', () => {
    expect(() => {
      resolvePath({ dependency: './bar' });
    }).toThrow(new Error('filename not given'));
  });

  it('throws if the directory is missing', () => {
    expect(() => {
      resolvePath({
        dependency: './bar',
        filename: path.join(directory, '/foo.js')
      });
    }).toThrow(new Error('directory not given'));
  });

  it('resolves with absolute paths', () => {
    const dependency = './bar';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    expect(resolved.startsWith(directory)).toBe(true);
  });

  it('resolves w/initial period, w/ending in .js', () => {
    const dependency = './index';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    const expected = path.join(directory, '/index.js');
    expect(resolved).toBe(expected);
  });

  it('resolves w/initial period, w/o ending in .js', () => {
    const dependency = './index.js';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    const expected = path.join(directory, '/index.js');
    expect(resolved).toBe(expected);
  });

  it('resolves w/o initial period, w/o ending in .js', () => {
    const dependency = 'index';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    const expected = path.join(directory, '/index.js');
    expect(resolved).toBe(expected);
  });

  it('resolves w/o initial period, w/ending in .js', () => {
    const dependency = 'index.js';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    const expected = path.join(directory, '/index.js');
    expect(resolved).toBe(expected);
  });

  it('resolves relative paths', () => {
    const dependency = './bar.js';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    const expected = path.join(directory, '/bar.js');
    expect(resolved).toBe(expected);
  });

  it('resolves non-relative paths', () => {
    const dependency = 'feature2/bar';
    const filename = path.join(directory, '/feature1/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    const expected = path.join(directory, '/feature2/bar.js');
    expect(resolved).toBe(expected);
  });
});

describe('multiple period filenames', () => {
  it('resolves with multiple periods in the dependency path', () => {
    const dependency = './bar.baz.qux';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    const expected = path.join(directory, '/bar.baz.qux.js');
    expect(resolved).toBe(expected);
  });

  it('does not duplicate extensions', () => {
    const dependency = '../index.js';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    const remainingExt = path.extname(path.basename(resolved, '.js'));
    expect(remainingExt).toBe('');
  });

  it('does not add the incorrect extension for sass files', () => {
    const dependency = 'styles';
    const filename = path.join(directory, '/foo.scss');
    const resolved = resolvePath({ dependency, filename, directory });
    expect(path.extname(resolved)).toBe('.scss');
  });

  it('does not add the incorrect extension for mustache files', () => {
    const dependency = 'hgn!templates/foo.mustache';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    expect(path.extname(resolved)).toBe('.mustache');
  });
});

describe('implicit jspm/systemjs style plugins', () => {
  it('resolve w/initial period', () => {
    const dependency = './templates/file.css!';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    expect(path.extname(resolved)).toBe('.css');
  });

  it('resolve w/o initial period', () => {
    const dependency = 'templates/file.css!';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    expect(path.extname(resolved)).toBe('.css');
  });
});

describe('explicit jspm/systemjs style plugins', () => {
  it('resolve w/initial period', () => {
    const dependency = './templates/file.txt!text';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    expect(path.extname(resolved)).toBe('.txt');
  });

  it('resolve w/o initial period', () => {
    const dependency = 'templates/file.txt!text';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    expect(path.extname(resolved)).toBe('.txt');
  });
});

describe('webpack support', () => {
  it.skip('resolves properly', () => {
    const dependency = './styles/foo.css';
    const filename = path.join(directory, '/foo.js');
    const resolved = resolvePath({ dependency, filename, directory });
    expect(path.extname(resolved)).toBe('.css');
  });
});
