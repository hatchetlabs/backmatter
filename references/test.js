'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const matter = require('gray-matter');
const backmatter = require('./index.js');

test('Frontmatter is unchanged', () => {
  const input = '---\ntitle: Home\n---\nThe writing.\n';
  const front = matter(input);
  const parsed = backmatter(input);
  assert.equal(parsed.backmatter, undefined);
  assert.deepEqual(parsed.data, front.data);
  assert.equal(parsed.content, front.content);
});

test('a trailing block is Backmatter', () => {
  const parsed = backmatter('The writing comes first.\n\n---\ntitle: any metadata\n---\n');
  assert.equal(parsed.backmatter, true);
  assert.deepEqual(parsed.data, { title: 'any metadata' });
  assert.equal(parsed.content, 'The writing comes first.\n\n');
});

test('root keys combine and Frontmatter wins a clash', () => {
  const input = [
    '---',
    'title: Front',
    'author: Ada',
    'meta:',
    '  keep: front',
    '  drop: no',
    '---',
    'Body',
    '',
    '---',
    'title: Back',
    'tags:',
    '  - note',
    'meta:',
    '  keep: back',
    '  extra: yes',
    '---',
    ''
  ].join('\n');
  const parsed = backmatter(input);
  assert.equal(parsed.backmatter, true);
  assert.deepEqual(parsed.data, {
    title: 'Front',
    author: 'Ada',
    tags: ['note'],
    meta: { keep: 'front', drop: 'no' }
  });
  assert.equal(parsed.content, 'Body\n\n');
});

test('a single closing fence stays in the body', () => {
  const input = 'Thanks for reading.\n\n---\n';
  const parsed = backmatter(input);
  assert.equal(parsed.backmatter, undefined);
  assert.deepEqual(parsed.data, {});
  assert.equal(parsed.content, input);
});

test('an empty front falls through to the tail', () => {
  const input = '---\n---\nThe writing.\n\n---\ntitle: End\n---\n';
  const parsed = backmatter(input);
  assert.equal(parsed.backmatter, true);
  assert.deepEqual(parsed.data, { title: 'End' });
  assert.equal(parsed.content, 'The writing.\n\n');
});

test('a block that is the whole document is Frontmatter', () => {
  const parsed = backmatter('---\ntitle: Only\n---\n');
  assert.equal(parsed.backmatter, undefined);
  assert.deepEqual(parsed.data, { title: 'Only' });
});

test('stringify places the block at the end', () => {
  const text = backmatter.stringify('The writing comes first.\n\n', { title: 'any metadata' });
  const parsed = backmatter(text);
  assert.equal(parsed.backmatter, true);
  assert.deepEqual(parsed.data, { title: 'any metadata' });
  assert.equal(parsed.content, 'The writing comes first.\n\n');
});

test('stringify is reachable as a named export', async () => {
  // cjs-module-lexer only exports what it can see statically, so this fails
  // unless index.js assigns module.exports.stringify explicitly.
  const mod = await import('./index.js');
  assert.equal(typeof mod.default, 'function');
  assert.equal(typeof mod.stringify, 'function');
  assert.equal(
    mod.stringify('Body.\n', { a: 1 }),
    'Body.\n---\na: 1\n---\n'
  );
});
