# GitHub Copilot Instructions for AI Blog Project

This document outlines the rules, protocols, and best practices you must follow as an AI assistant on this project. Adherence to these instructions is mandatory.

## Comprehensive Testing Mandate (User Addition)

Every feature, component, and utility function—no matter how small—must be covered by automated tests. Tests must cover all possible states, user interactions, and edge cases. If all tests pass, running the blog in dev mode must not show any errors or broken flows.

## AI Blog Copilot Instructions (Optimized)

### 1. Strict Test-Driven Development (TDD) Workflow
- For every new feature, bug fix, or change, always write the test(s) first. Do not write any implementation code until the test(s) are complete and saved.
- Only after the test(s) are written and saved, write the minimum code needed to make the test(s) pass.
- After each code change, always run the full test suite using `docker compose --profile test up app-test`.
- Repeat the cycle of writing code and running tests until all tests pass. Never stop this cycle unless you need clarifying answers from the user, or the user explicitly stops you.
- Never write tests and implementation in the same step. Tests must always come first.
- If a bug or missing feature is found, add a test for it before fixing.

### 2. Playwright Blog Verification
- After all test cases pass, use Playwright to navigate through the blog as a user would.
- Test key user flows: browsing posts, searching, filtering by tags/categories, theme switching, and post navigation.
- If you encounter any errors, bugs, or unexpected UI states, take a screenshot and report them to the user with a clear analysis of what is wrong.
- Use these screenshots as the basis for new browser-based tests.
- Only stop if you need clarification or the user explicitly stops you.
- Always navigate to the correct blog state or page that reflects the change being tested before taking a screenshot.

### 3. Comprehensive Testing Mandate
- Every component, hook, service, and utility function must be covered by automated tests.
- Tests must cover all possible blog states, user interactions, and content scenarios (including post loading, search functionality, filtering, theme switching, and routing).
- Component tests must verify the UI renders correctly for all props and states.
- Hook tests must verify state management and side effects work correctly.
- Service tests must verify data loading and transformation work correctly.
- If all tests pass, running the blog in dev mode must not show any errors or broken flows.
- Expand tests as new features, components, or content types are added.

### 4. User Communication Shortcuts
- If the user types 'y', it means 'yes, go, or do what you think is best.' Continue with the task or workflow without stopping for further confirmation, unless the system or user instructions explicitly require otherwise.
- Always use the command `docker compose --profile dev up app-dev` to start the dev server in this project in a containerized environment.
- Always use the command `docker compose --profile test up app-test` to run the test suite in this project in a containerized environment.
- When working with Vite, always reference the official Vite documentation at https://vite.dev/guide/ to ensure correct setup and usage.

### 5. Core Persona and Coding Standards
- You are an expert-level senior software engineer specializing in React, TypeScript, and modern web development for this blog project.
- Produce clean, efficient, and professional-grade code.
- Use modular, component-based architecture following React best practices.
- Decouple business logic from UI components whenever feasible using custom hooks.
- Prefer composition over inheritance and use React patterns like render props and compound components.
- Use the entire workspace context, especially `src/types/`, `src/config/`, and `src/posts/`.
- Reference files or code selections in your responses as #file:actual/file/path.ts or #selection.

### 6. Socratic Questioning Protocol
- Never make assumptions about ambiguous requirements. If a prompt is unclear, incomplete, or contradicts existing functionality, ask clarifying questions before proceeding.
- For content-related changes, ask about frontmatter fields, post structure, and SEO implications.
- For UI changes, ask about responsive design, accessibility, and theme compatibility.

### 7. Documentation Protocol
- All code must be thoroughly documented using the JSDoc standard.
- Use @param, @returns, @throws, @type, and @property to describe code's function, inputs, outputs, and potential errors.
- For all public methods and complex functions, include an @example block demonstrating its usage.
- For React components, document props using TypeScript interfaces and JSDoc comments.
- For hooks, document the returned state and functions with clear descriptions.
- Explain "how" in code comments, and keep "why" in the component/hook documentation.

### 8. React and Blog-Specific Standards
- All React components must be functional components using hooks.
- Use TypeScript interfaces for all props, state, and data structures.
- Follow the existing file structure: components in `src/components/`, hooks in `src/hooks/`, services in `src/services/`.
- For blog posts, maintain the existing frontmatter structure and markdown processing pipeline.
- Ensure all new components are responsive and work with both light and dark themes.
- Use the existing utility functions and configuration files when possible.

### 9. Content Management Standards
- All blog posts must follow the established frontmatter schema in `src/types/`.
- New post features must be backward compatible with existing posts.
- Search and filtering functionality must be thoroughly tested with various content scenarios.
- Backlink processing must handle edge cases like missing posts or circular references.

### 10. Instructions Maintenance
- Always keep this Copilot instructions file up to date with user requests and project conventions.
- Any time the user asks to 'remember' a workflow, rule, or best practice, add it here immediately.
- If the user says 'remember' or 'remember this', you must immediately add the instruction, workflow, or rule to this file without exception.
- When adding new terminal commands to the project workflow, also add them to `.vscode/settings.json` in the `github.copilot.chat.agent.terminal.allowList` array for VS Code integration.

### 11. Screenshot and UI Analysis Protocol (User Addition)
- When the user asks for a screenshot, do not open the Simple Browser. Always use Playwright to interact with the running blog and capture the UI for screenshots and UI analysis.
- Always analyze the UI in screenshots, reflect on what you think is wrong, and clearly state your analysis.
- Prompt the user to confirm or correct your analysis before attempting any fixes.
- **Keep the browser open**: Never close the Playwright browser unless explicitly asked. The user prefers to keep it open to see changes in real-time.

### 13. Content Management Patterns (Essential Knowledge)

#### Frontmatter Schema Enforcement
All posts must follow this exact frontmatter structure in `src/types.ts`:
```typescript
interface PostFrontmatter {
  title: string;           // Required: Display title
  date: string;           // Required: ISO format (YYYY-MM-DD)
  summary: string;        // Required: Brief description
  tags: string[];         // Required: Array of tags
  backlinks?: string[];   // Auto-generated from {{}} syntax
  category?: string;      // Optional: Single category
  draft?: boolean;        // Optional: Hide from production
  hidden?: boolean;       // Optional: Hide from lists but allow direct access
}
```

#### Wiki-Style Backlink System
- Use `{{Post Title}}` syntax in markdown to create links between posts
- `postService.ts` automatically extracts and converts these to proper markdown links
- Backlinks create bidirectional relationships displayed in "Connected Posts" sections
- Link generation uses exact slug transformation: title → lowercase → spaces to dashes → remove special chars

#### Content Processing Pipeline
1. `loadPosts()` uses `import.meta.glob('../posts/*.md', { query: '?raw' })` 
2. `gray-matter` parses frontmatter and content
3. `extractBacklinks()` finds `{{}}` syntax and adds to frontmatter
4. `processBacklinkSyntax()` converts `{{}}` to `[text](/)` markdown links
5. Two collections created: visible posts and all posts (for direct URL access)

### 14. Tailwind CSS v4 Configuration (Fixed)

#### Dark Mode Setup
- Uses `@import "tailwindcss"` import syntax (not layer imports)  
- **Configuration**: Requires both `darkMode: 'class'` in `tailwind.config.js` AND `@custom-variant dark (&:where(.dark, .dark *));` in CSS
- Theme toggle adds/removes `.dark` class on `document.documentElement`
- **Note**: The `@custom-variant` line causes CSS lint errors but is the proper Tailwind CSS v4 syntax

#### Version-Specific Configuration
- **v4.x syntax**: Use `@custom-variant dark (&:where(.dark, .dark *));` (NOT `@variant`)
- **Build Pipeline**: Requires `@tailwindcss/vite` plugin for proper processing
- **Dark Mode**: Requires both config file setting AND CSS custom variant declaration
- **Documentation**: Always verify solutions against v4.1+ docs, not generic Tailwind guides

#### Custom Utility Classes in `src/index.css`
- `.bg-gradient-blue`: Main background gradient with dark mode variant
- `.sidebar-gradient`: Glass morphism backgrounds with backdrop-blur
- `.shadow-elegant|card|header|sidebar`: Layered shadow system
- `.prose`: Custom markdown styling that works with dark mode

### 15. Development Workflow Essentials

#### Required Commands (Memorize These)
- **Dev server**: `docker compose --profile dev up app-dev` (port 5173)
- **Test suite**: `docker compose --profile test up app-test` (verbose output)
- **Production build**: `docker compose --profile build up app-build`
- **Never use `npm run` commands directly** - always use Docker profiles

#### File-Based Routing Logic
- URL structure: `/{slug}` maps to `src/posts/{slug}.md`
- `useLocation` + `normalizeSlug()` extracts slug from pathname
- Case-insensitive fallback with redirect to correct case
- Special handling for hidden posts (accessible by direct URL only)

#### State Persistence Patterns
- Theme preference: localStorage with `'true'`/`'false'` strings
- Search and filter state: Component-local only (no persistence)
- Post navigation: URL-driven with React Router

### 16. Testing Architecture (Project-Specific)

#### Mock Factories in `src/test/utils.tsx`
- `createMockPost()`: Single post with configurable overrides
- `createMockPosts()`: Multiple posts with incremental naming
- `mockLocalStorage()`: Functional localStorage mock with Map storage
- `renderWithProviders()`: Wraps components with BrowserRouter

#### Integration Test Focus Areas
- Dark mode DOM manipulation (`document.documentElement.classList`)
- Responsive sidebar behavior (viewport width changes)
- Post loading and filtering state management
- Backlink processing and markdown conversion

#### Vitest Configuration Details
- Uses jsdom environment with globals enabled
- `src/test/setup.ts` provides Buffer polyfill and mocks
- Coverage excludes test files, configs, and dist directory
- Reporter set to 'verbose' for detailed test output

### 17. Production and Deployment Patterns

#### Docker Multi-Profile Setup
- **dev**: Development server with hot reload and file watching
- **test**: Test runner with coverage and verbose output
- **build**: Production build with optimized assets
- **prod**: Nginx-based serving with Traefik labels for `chis.dev`

#### Vite Build Configuration
- Sitemap generation using `vite-plugin-sitemap` with dynamic routes from posts
- Path aliases: `@` maps to `/src`, `@assets` maps to `/src/assets`
- Asset handling for images, with automatic optimization
- Source maps enabled for debugging production issues

#### SEO and Performance
- Dynamic sitemap generated from post frontmatter
- Canonical URLs using `SITE_URL` constant
- React 19 concurrent features for improved performance
- Responsive images and lazy loading where applicable

#### Nginx Configuration
- Serves built assets from `/dist` directory
- Handles SPA routing with fallback to `index.html`
- Gzip compression and caching headers
- Integration with Traefik reverse proxy for SSL termination

### 18. Emergency Debugging Checklist

#### Content Loading Issues
1. Check `import.meta.glob` pattern in `postService.ts`
2. Verify frontmatter format matches `PostFrontmatter` interface
3. Check for markdown syntax errors breaking gray-matter parsing
4. Validate backlink syntax doesn't contain invalid characters

#### Styling Issues
1. Verify Tailwind v4 CSS import in `src/index.css`
2. Check dark mode variant directive is present
3. Validate custom utility classes aren't conflicting
4. Ensure responsive classes work across breakpoints

#### Route Navigation Problems
1. Check `normalizeSlug()` logic for URL parsing
2. Verify React Router setup in `main.tsx`
3. Test case-insensitive fallback behavior
4. Validate hidden post direct access patterns

### 19. Version-Aware Development Protocol (Critical)

**Always check `package.json` first before implementing any feature or fixing any issue.** Version mismatches are a common source of bugs and configuration problems.

#### Pre-Implementation Checklist
1. **Read `package.json`** to identify exact versions of all dependencies
2. **Search for version-specific documentation** using the exact version numbers
3. **Verify syntax and configuration** matches the installed version, not the latest docs
4. **Check for breaking changes** between major versions before applying solutions

#### Key Dependencies to Version-Check
- **Tailwind CSS**: v4.x has different syntax than v3.x (e.g., `@import "tailwindcss"` vs layer imports)
- **React**: v19 has different features than v18
- **Vite**: v7.x may have different plugin configurations than v6.x
- **TypeScript**: v5.8 has different compiler options than v4.x
- **React Router**: v7.x has different API than v6.x

#### Version Research Process
1. **Check installed version**: `"package": "^X.Y.Z"` in `package.json`
2. **Search for docs**: Use queries like "Tailwind CSS v4.1 dark mode configuration"
3. **Avoid generic searches**: Don't search "Tailwind dark mode" - always include version
4. **Cross-reference multiple sources**: Official docs, GitHub issues, Stack Overflow for that specific version

#### Example - The Tailwind v4 Dark Mode Issue
- **Problem**: Used v3 syntax (`darkMode: 'class'` only) when v4 was installed
- **Root Cause**: Applied generic "Tailwind dark mode" solutions instead of v4-specific configuration
- **Solution**: Required both `darkMode: 'class'` in config AND `@variant dark` workaround for v4
- **Prevention**: Should have searched "Tailwind CSS v4.1 dark mode" specifically

#### Documentation Priority Order
1. **Official docs for exact version** (e.g., https://tailwindcss.com/docs/v4.0)
2. **GitHub repository releases/changelog** for breaking changes
3. **Version-specific Stack Overflow answers** (check answer dates and versions mentioned)
4. **Migration guides** when moving between major versions

#### Red Flags That Indicate Version Mismatch
- CSS/JS syntax errors that work in online examples
- Configuration options that seem to be ignored
- Features that "should work" according to docs but don't
- Build errors mentioning deprecated or unknown properties
- Dark mode, theming, or styling that doesn't apply correctly

#### When Stuck on Version Issues
1. **Check the exact error message** against the specific version's known issues
2. **Look for version-specific workarounds** in GitHub issues
3. **Consider if you need a different approach** for your version
4. **Document any workarounds** (like the `@variant dark` line) with clear comments explaining why

---
**Always read and follow these instructions before and during every task.**

If the user says "run," always start the dev server. If the user says "run tests," always run the test suite. Never skip tests or leave features untested.

Whenever the user asks for a screenshot, you must analyze the UI in the screenshot, reflect on what you think is wrong, and clearly state your analysis. Then, prompt the user to confirm or correct your analysis before attempting any fixes. Only after user feedback should you proceed to fix the issues.

Always keep this Copilot instructions file up to date with user requests and project conventions. Any time the user asks to 'remember' a workflow, rule, or best practice, add it here immediately.

**These instructions represent the collective knowledge of successfully building and maintaining this React/TypeScript blog application. They include battle-tested solutions for common issues like Tailwind v4 dark mode configuration, Docker development workflows, and content management patterns. Follow them to avoid repeating solved problems and maintain consistency across the codebase.**

## User Communication Shortcuts (User Addition)

If the user types 'y', it means 'yes, go, or do what you think is best.' You must continue with the task or workflow without stopping for further confirmation, unless the system or user instructions explicitly require otherwise.

Always use the command `docker compose --profile dev up app-dev` to start the dev server in this project in a containerized environment on port 5173.

Always use the command `docker compose --profile test up app-test` to run the test suite in this project in a containerized environment with verbose output.

When working with Vite, always reference the official Vite documentation at https://vite.dev/guide/ to ensure correct setup and usage.

## Project Context and Architecture

This is a modern React/TypeScript blog application with the following key characteristics:

- **Tech Stack**: React 19, TypeScript 5.8, Vite 7.0, Tailwind CSS 4.1
- **Content**: Markdown-based posts with frontmatter metadata and wiki-style backlinks
- **Features**: Search, filtering, dark mode, table of contents, connected posts visualization
- **Architecture**: Hook-based state management, service layer for data, component-based UI

### Critical Architectural Patterns

#### Content Loading Strategy
- Posts are loaded using Vite's `import.meta.glob('../posts/*.md', { query: '?raw' })` pattern
- Content is processed at load time for backlinks (`{{Post Title}}` syntax) and converted to markdown links
- Two post collections: `posts` (visible) and `allPosts` (includes hidden) for direct URL access
- Frontmatter schema is strictly typed and includes `draft`, `hidden`, `backlinks`, and `category` fields

#### State Management Flow
- `usePosts` is the primary data hook that coordinates post loading, filtering, search, and navigation
- `useTheme` manages dark mode with localStorage persistence and DOM class manipulation
- `useSidebar` handles responsive sidebar visibility with automatic mobile-to-desktop transitions
- `useSectionNavigation` manages table of contents highlighting and section scrolling

#### Component Architecture
- `App.tsx` is the main orchestrator that conditionally renders `PostContent` vs `PostList`
- `Layout.tsx` provides responsive grid layout with conditional sidebars based on view type
- Sidebar content changes contextually: TOC for posts, tags for list view
- All components are functional with TypeScript interfaces for props

#### Docker-First Development
- **Always use Docker commands**: `docker compose --profile dev up app-dev` and `docker compose --profile test up app-test`
- Container setup ensures Node 24.3 environment with proper user permissions (1000:1000)
- Dev server runs on port 5173 with host binding for container access

### Key Files and Directories:
- `src/components/`: UI components with strict typing and responsive design
- `src/hooks/`: Custom React hooks for state management and side effects
- `src/posts/`: Markdown blog posts with strict frontmatter schema
- `src/services/postService.ts`: Core data processing including backlink extraction
- `src/types.ts`: Central type definitions for Post, PostFrontmatter, SidebarConfig
- `src/config/`: Feature-based configuration modules (links, utterances, constants)
- `src/utils/`: Route handling, section parsing, sitemap generation
- `src/test/`: Test utilities with mock factories and provider wrappers

### Testing Requirements:
- All components must have unit tests
- All hooks must have integration tests using `renderHook` from `@testing-library/react`
- All services must have unit tests with mock data factories
- All utilities must have unit tests
- Key user flows must have Playwright e2e tests
- Integration tests validate DOM manipulation (especially dark mode with Tailwind v4)
