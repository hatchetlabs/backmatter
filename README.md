# Backmatter

An amendment to Frontmatter.

> **Spec:** Backmatter is Frontmatter at the back of the file. Frontmatter is a YAML block between lines of three hyphens at the start of a document. Backmatter is that same block at the end of the file. The block may hold any YAML metadata. A parser reads both blocks and combines their root keys. A root key in both blocks keeps the Frontmatter value whole.

The body comes first. Read the writing before the metadata.

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

The combined data is `title: From the front`, `author: Ada`, and `tags: [note]`. The Backmatter title is dropped. `author` and `tags` remain, because each key appears only once.

- [Examples](#examples): Five documents show the shapes. A book page puts an index, a glossary, and a colophon in the back. A blog post splits keys by when each key is known. One document puts all metadata in the back, one withholds a title that would spoil the start, and one puts all metadata in the front to show the cost.
- [Tips](#tips): Use Frontmatter when a reader needs the metadata before the end arrives. Add two trailing spaces to one-level YAML lines in the back so Frontmatter-only renderers show readable text. Add a blank line before the final fence so the block does not render as a heading.
- [Reference Parser](#reference-parser): `references/index.js` calls gray-matter for each block and combines root keys. A shared root key keeps the Frontmatter value whole.

## Examples

- [examples/book.md](references/examples/book.md) is a page in the book sense. The front names the page. The back holds an index, a glossary, and a colophon.
- [examples/blog.md](references/examples/blog.md) splits a post. The front holds the title, the date, and the slug. The back holds tags and a note on the post.
- [examples/all-back.md](references/examples/all-back.md) lets the body lead. All metadata follows it.
- [examples/linear.md](references/examples/linear.md) starts with no title or description. A title at the start would spoil the text, so both sit in the back.
- [examples/all-front.md](references/examples/all-front.md) puts all metadata in the front. The metadata is longer than the sentence under it.

## Tips

- Use Frontmatter when a text streams in and a reader needs the metadata first.
- Both blocks use [YAML](https://yaml.org). [Frontmatter](https://jekyllrb.com/docs/front-matter/) uses the same form.
- A renderer that only knows Frontmatter shows a Backmatter block as plain Markdown. Add two trailing spaces to each YAML line at one level deep to keep the lines readable.
- Add an empty line before the final `---`. The block then does not render as a heading.

```markdown
title: "The window left open"  
description: "A note that discovers it is about letting the room change."  

---
```

## Reference Parser

`references/index.js` is the reference parser. It calls [gray-matter](https://github.com/jonschlinkert/gray-matter) for each block, then combines root keys.

```js
const backmatter = require('@hatchetlabs/backmatter');

backmatter('The writing comes first.\n\n---\ntitle: any metadata\n---\n');
// { data: { title: 'any metadata' }, content: 'The writing comes first.\n\n', backmatter: true }
```

