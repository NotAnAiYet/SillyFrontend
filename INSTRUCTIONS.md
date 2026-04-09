# Project Instructions for Copilot

## Setup
1. Install dependencies:
   - Run `npm install` in the project root.
2. Start the development server:
   - Run `npm run dev`.

## Development
- All source files are in the `src/` directory.
- Pages are in `src/pages/`.
- Components are in `src/components/`.
- Styles are in `src/styles/`.

## Notes
- Do not add comments that do not provide value to understanding or maintaining the code.
- Make sure the css style fits the previously established style of the website
- If you think the instructions are missing something by the user feedback, then ask the user if you should add it to the instructions

## Coding Conventions
- Use consistent formatting and naming conventions for Astro and React files (PascalCase for components, camelCase for variables and functions).
- Prefer functional React components and Astro components.
- Keep files and components small and focused on a single responsibility.
- Extract repeated UI or logic into reusable components in `src/components/`.
- Use props for component configuration and avoid hardcoding values.
- Use CSS modules or scoped styles for component-specific styles; global styles go in `src/styles/global.css`.
- Keep business logic out of UI components when possible; use utility functions or hooks.
- Prefer composition over inheritance.
- Remove unused code and imports.
- Ensure all code fits the general style and structure of the project.