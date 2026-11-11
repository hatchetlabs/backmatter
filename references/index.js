'use strict';

const matter = require('gray-matter');
const defaults = require('gray-matter/lib/defaults');

/**
 * Parse Frontmatter and a mirrored block at the end of the document.
 * Root keys from both are combined. Where a root key exists in both, the
 * Frontmatter value is kept whole. Nested values are not merged.
 */

function backmatter(input, options) {
  const front = matter(input, options);
  const tail = splitTail(front.content, options);
  if (!tail) return front;

  const parsed = matter(tail.fenced + tail.body, options);
  parsed.data = combineRoot(front.data, parsed.data);
  parsed.backmatter = true;
  parsed.orig = front.orig;
  parsed.stringify = function(data, opts) {
    return stringify(parsed.content, data == null ? parsed.data : data, opts || options);
  };
  return parsed;
}

/**
 * Frontmatter wins at the root only. A shared key keeps the front value
 * intact, including when that value is itself a map.
 */

function combineRoot(frontData, backData) {
  if (isPlainObject(frontData) && isPlainObject(backData)) {
    return Object.assign({}, backData, frontData);
  }
  if (isPlainObject(frontData) && Object.keys(frontData).length === 0) return backData;
  return frontData;
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Place a metadata block at the end of content. An empty body is only the
 * block, which a parser then reads as Frontmatter.
 */

function stringify(content, data, options) {
  const rendered = matter.stringify(content || '', data, options);
  const file = matter(rendered, options);
  if (!file.matter) return rendered;

  const opts = defaults(options);
  const open = opts.delimiters[0];
  const close = opts.delimiters[1];
  let body = file.content;
  if (body.length && !body.endsWith('\n')) body += '\n';
  return body + open + '\n' + file.matter.trim() + '\n' + close + '\n';
}

function splitTail(content, options) {
  const opts = defaults(options);
  const open = opts.delimiters[0];
  const close = opts.delimiters[1];
  let text = String(content).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  if (text.endsWith('\n')) text = text.slice(0, -1);
  if (text === '') return null;

  const lastBreak = text.lastIndexOf('\n');
  const closeLine = lastBreak === -1 ? text : text.slice(lastBreak + 1);
  if (!isFence(closeLine, close)) return null;

  const beforeClose = text.slice(0, lastBreak === -1 ? 0 : lastBreak);
  const openerAt = lastFence(beforeClose, open);
  if (openerAt < 0) return null;

  const yaml = beforeClose.slice(openerAt + open.length).replace(/^[ \t]*\n/, '');
  const body = beforeClose.slice(0, openerAt);
  const fenced = open + '\n' + yaml.replace(/\n$/, '') + '\n' + close + '\n';
  return { body, fenced };
}

function isFence(line, delimiter) {
  return new RegExp('^' + escapeRegExp(delimiter) + '[ \\t]*$').test(line);
}

function lastFence(text, delimiter) {
  const re = new RegExp('(?:^|\\n)(' + escapeRegExp(delimiter) + ')[ \\t]*(?=\\n|$)', 'g');
  let match;
  let at = -1;
  while ((match = re.exec(text))) {
    at = match.index + (text[match.index] === '\n' ? 1 : 0);
  }
  return at;
}

function escapeRegExp(value) {
  return value.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}

backmatter.stringify = stringify;
module.exports = backmatter;
