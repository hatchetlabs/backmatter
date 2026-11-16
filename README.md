# Backmatter

An amendment to Frontmatter.

> **Spec:** Backmatter is Frontmatter at the back of the file.  
> Frontmatter is a YAML block between lines of three hyphens at the start of a document. Backmatter is that same block at the end of the file. The block may hold any YAML metadata. A parser reads both blocks and combines their root keys. If root keys collide Frontmatter wins.

The body comes first. Read the writing before the metadata.

```markdown
Sometimes you don't know the metadata, until the document's been written.

Maybe the metadata is longer than the file.  
Sometimes the main content needs to be front-and-center.

Backmatter plays nice with Frontmatter.  
If the keys are duplicates, Frontmatter wins.

---
title: "When Backmatter matters"  
tags: ["Backmatter", "Frontmatter", "Markdown", "YAML"]  

---
```

## Examples

- [examples/book.md](references/examples/book.md) is a page in the book sense. The front names the page. The back holds an index, a glossary, and a colophon.
- [examples/linear.md](references/examples/linear.md) starts with no title or description. A title at the start would spoil the text, so both sit in the back.
- [examples/all-front.md](references/examples/all-front.md) puts all metadata in the front. Why Backmatter exists. 

## Tips

- Use Frontmatter when a text streams in and a reader needs the metadata first.
- Both blocks use [YAML](https://yaml.org). [Frontmatter](https://jekyllrb.com/docs/front-matter/) uses the same form.
- A renderer that only knows Frontmatter shows a Backmatter block as plain Markdown. Add two trailing spaces to each YAML line at one level deep to keep the lines readable.
- Add an empty line before the final `---`. The block then does not render as a heading.

```markdown
---
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

---
name: Backmatter  
description: Read the body before the metadata.  

---
