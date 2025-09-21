# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server with hot reload at http://localhost:5173
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Serve production build for testing
- `npm run lint` - Run ESLint on TypeScript files
- `npm run lint -- --fix` - Auto-fix ESLint issues

## Project Architecture

This is a React + TypeScript application for visualizing OpenAI chat completion JSON data. The app provides a side-by-side view of raw JSON and a formatted chat visualization.

### Core Application Structure

- **Main App (`src/App.tsx`)**: Root component managing state for JSON data, configuration, and synchronized scrolling between panels
- **AppRouter (`src/AppRouter.tsx`)**: Simple router wrapper (currently single route)
- **Entry point**: `src/index.tsx` renders AppRouter

### Key Components

- **JsonEditor**: Monaco editor for editing chat completion JSON with syntax highlighting and validation
- **ChatVisualization**: Renders parsed JSON as formatted chat messages with support for tool calls
- **MessageBubble**: Individual message component supporting user/assistant/system/tool roles
- **FunctionsPanel**: Displays available tools/functions from the JSON schema
- **ConfigPanel**: Settings panel for dark mode, timestamps, spacing, etc.

### Data Flow

1. Default chat data loads from `src/utils/defaultData.js` (includes sample tool calls)
2. JSON editor validates and parses user input in real-time
3. Parsed data flows to chat visualization components
4. Both panels support synchronized scrolling
5. Message selection highlights corresponding JSON sections

### Key Features

- **Synchronized scrolling** between JSON editor and chat visualization
- **Real-time JSON validation** with error highlighting
- **Tool calls visualization** for OpenAI function calling
- **Dark mode support** throughout the application
- **Editable messages** in both JSON and chat views

## Technology Stack

- **Vite** for build tooling and dev server
- **React 18** with functional components and hooks
- **TypeScript** for type safety
- **Monaco Editor** for JSON editing experience
- **Tailwind CSS** for styling
- **React Router** for routing (minimal usage)

## Code Style

- Use 2-space indentation
- Prefer functional React components with hooks
- Export components in PascalCase, utilities in camelCase
- Explicit prop typing (avoid `any`)
- Tailwind utility classes for styling (extend `tailwind.config.js` vs global CSS)