---
name: 'backmatter'
description: 'Writes and parses Backmatter, the YAML metadata block at the end of a Markdown document, and works with Frontmatter in the same document. Use when a Markdown document holds metadata at the end, a document needs that block added or read, or combined Frontmatter and Backmatter data must be checked.'
metadata:
  origin: 'backmatter'
---

# Backmatter

Backmatter is a YAML block at the end of a Markdown document. The body comes first. Read the writing before the metadata.

- [Format](#format): Backmatter is the Frontmatter block at the end of a document. The closing fence is the last line, and the block may hold any metadata.
- [Write a document](#write-a-document): Write the body first, then add the block. Two trailing spaces and a blank line keep the block readable in a renderer that only knows Frontmatter.
- [Parse a document](#parse-a-document): Read the front block and the back block, remove both from the content, and combine root keys. A shared root key keeps the Frontmatter value whole.
- [Reference parser](#reference-parser): `references/index.js` parses a document and places a block at the end with `stringify`.
- [Examples](#examples): Three documents show metadata only in the back, metadata split between the front and the back, and structured matter in the back.

## Format

Frontmatter is a YAML block between lines of three hyphens at the start of a document. Backmatter is that same block at the end.

A document may hold a block at the start, a block at the end, or both blocks.

```markdown
---
title: "From the front"
author: "Ada"
---

The writing comes first.

---
title: "From the back"
tags: ["note"]

---
```

The combined data is `title: "From the front"`, `author: "Ada"`, and `tags: ["note"]`. Each key appears once, except `title`; the Frontmatter value of `title` stays.

## Write a document

1. Write the body.
2. Add a line with `---`.
3. Add the YAML.
4. Add a line with `---` as the last line of the document.

A renderer that only knows Frontmatter shows a Backmatter block as plain Markdown. Add two trailing spaces to a YAML line at one level deep to make that text readable. Add an empty line before the final `---` to keep the block from rendering as a heading.

## Parse a document

1. Parse the block at the start as Frontmatter.
2. Parse the block at the end as Backmatter. The closing fence is the last line.
3. Remove both blocks from the content.
4. Combine the root keys. A root key in both blocks keeps the Frontmatter value whole. A nested value also stays whole.

A closing fence with no block before it is body text. An empty Frontmatter block leaves the Backmatter data in place.

## Reference parser

`references/index.js` is the reference parser for this repo. It calls gray-matter for each block, then combines the root keys.

```js
const backmatter = require('@hatchetlabs/backmatter');

backmatter('The writing comes first.\n\n---\ntitle: any metadata\n---\n');
// { data: { title: 'any metadata' }, content: 'The writing comes first.\n\n', backmatter: true }

backmatter.stringify('The writing comes first.\n\n', { title: 'any metadata' });
// The writing comes first, with the block at the end.
```

Parse the result again to check a parse. The data and the content stay the same.

## Examples

- [All back](references/examples.md#all-back): The front holds no metadata. The back holds the title, the date, the slug, the description, and the tags.
- [Split](references/examples.md#split): The front holds the title, the date, and the slug. The back holds the tags and a note.
- [Book](references/examples.md#book): The front holds the title and the author. The back holds an index, a glossary, and a colophon.
