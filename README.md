# Deno Semantic Blog Platform

A high-performance blog with fuzzy search, backlinking, and tag filtering powered by:

- Deno Oak web server
- Fuse.js for fuzzy search
- Tailwind CSS for styling
- Markdown with frontmatter parsing

## Features

- **Semantic Search**
  - Fuzzy matching with typo tolerance
  - Content highlighting in results
  - Keyboard navigation (↑/↓/Enter)
  - Local storage caching of search index
  - N-gram indexing (trigrams)
  - Search term weighting (title > tags > content)
  
- **Post Features**
  - Wiki-style backlinks between posts
  - Tag system with filtering
  - Responsive design
  - Markdown content with code highlighting

## Project Structure

```text
/
├── posts/               # Markdown posts (YAML frontmatter)
├── public/              # Static assets
├── utils/               # Core functionality
│   ├── posts.ts         # Post processing & search
│   └── ngrams.ts        # Text analysis utilities
├── views/               # Templates
│   ├── layout.ejs       # Base template
│   ├── index.ejs        # Main page with search
│   └── post.ejs         # Post rendering template
└── main.ts              # Server entrypoint
```

## Installation & Usage

```bash
# Run development server (with auto-reload):
deno run --allow-read --allow-net --watch main.ts

# Create new post:
cp posts/template.md posts/new-post-slug.md
```

## Post Format

```markdown
---
title: My Post
date: 2024-03-01
description: Post summary
tags: [tech, webdev]
---

Content with [[wiki-style links]] to other posts...
```

## Search Implementation Details

The search system combines:
- N-gram vectorization of content
- LocalStorage caching of search indices
- Debounced input (300ms delay)
- Result scoring + relevance ordering
- Client-side result highlighting
