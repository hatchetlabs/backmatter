# Backmatter examples

Three complete documents. Each one is short enough to read in full.

- [All back](#all-back): The front holds no metadata. The back holds the title, the date, the slug, the description, and the tags.
- [Split](#split): The front holds the title, the date, and the slug. The back holds the tags and a note, and one key lists another document.
- [Book](#book): The front holds the title and the author. The back holds an index, a glossary, and a colophon.

## All back

```markdown
# A short argument

Put the writing where a reader looks.

## The page

Headings, paragraphs, and lists are the document. They are the first thing in the file.

## What can wait

A date and a slug can follow the argument. They do not need to stand above it.

---
title: "A short argument"  
date: "2026-11-03"  
slug: "a-short-argument"  
description: "The page leads. The record follows."  
tags: ["reading", "metadata"]  

---
```

## Split

```markdown
---
title: "Why the writing comes first"  
date: "2026-11-03"  
slug: "writing-comes-first"  

---

A post can be titled before it is written. The notes that name what it turned out to be belong after the paragraphs.

---
tags: ["metadata", "reading"]  
see_also:  
  - "A Page, in the book sense"  
note: "written after the two sentences above"  

---
```

## Book

```markdown
---
title: "A Page"  
author: "The Printer"  

---

The sentence is the work. What follows was written once this sentence could be seen.

---
index:  
  - term: "sentence"  
    see: "the body"  
glossary:  
  Backmatter: "matter that follows the work and refers to it"  
colophon: "set after the page was read"  

---
```
