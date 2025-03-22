# Digital Garden / Blog

A modern, responsive blog/digital garden built with React, TypeScript, and Tailwind CSS.

## Project Structure

```
src/
├── components/       # UI components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── posts/            # Markdown blog posts
├── services/         # Data services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Key Features

- Markdown-based content with frontmatter
- Backlinks between posts (wiki-style)
- Full-text search
- Tag and category filtering
- Dark mode support
- Responsive design
- Table of contents
- Connected posts visualization

## Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Adding Content

Create new `.md` files in the `src/posts/` directory with the following frontmatter format:

```markdown
---
title: Your Post Title
date: 2023-01-01
summary: A brief summary of the post
tags: [tag1, tag2]
category: Category
---

Your content here...
```

## Linking Between Posts

Use the `{{Post Title}}` syntax to create backlinks between posts.

## Architecture

The application uses a custom hook-based architecture:

- `usePosts`: Manages post loading, filtering, and navigation
- `useTheme`: Handles dark/light mode
- `useSidebar`: Controls sidebar visibility
- `useSectionNavigation`: Manages section scrolling and highlighting

## License

MIT
