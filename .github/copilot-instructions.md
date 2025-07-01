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

---
**Always read and follow these instructions before and during every task.**

If the user says "run," always start the dev server. If the user says "run tests," always run the test suite. Never skip tests or leave features untested.

Whenever the user asks for a screenshot, you must analyze the UI in the screenshot, reflect on what you think is wrong, and clearly state your analysis. Then, prompt the user to confirm or correct your analysis before attempting any fixes. Only after user feedback should you proceed to fix the issues.

Always keep this Copilot instructions file up to date with user requests and project conventions. Any time the user asks to 'remember' a workflow, rule, or best practice, add it here.

## User Communication Shortcuts (User Addition)

If the user types 'y', it means 'yes, go, or do what you think is best.' You must continue with the task or workflow without stopping for further confirmation, unless the system or user instructions explicitly require otherwise.

Always use the command `docker compose --profile dev up app-dev` to start the dev server in this project in a containerized environment on port 5173.

Always use the command `docker compose --profile test up app-test` to run the test suite in this project in a containerized environment with verbose output.

When working with Vite, always reference the official Vite documentation at https://vite.dev/guide/ to ensure correct setup and usage.

## Project Context and Architecture

This is a modern React/TypeScript blog application with the following key characteristics:

- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS, React Router
- **Content**: Markdown-based posts with frontmatter metadata
- **Features**: Search, filtering, dark mode, backlinks, table of contents
- **Architecture**: Hook-based state management, service layer for data, component-based UI

### Key Files and Directories:
- `src/components/`: React components for UI
- `src/hooks/`: Custom React hooks for state management
- `src/posts/`: Markdown blog posts with frontmatter
- `src/services/`: Data services and business logic
- `src/types/`: TypeScript type definitions
- `src/config/`: Configuration files
- `src/utils/`: Utility functions

### Testing Requirements:
- All components must have unit tests
- All hooks must have integration tests
- All services must have unit tests
- All utilities must have unit tests
- Key user flows must have Playwright e2e tests
