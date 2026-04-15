# LangEdge

A modern AI-powered language learning and translation platform.

## Overview

LangEdge is a web application designed to make language learning and translation accessible and efficient through AI technology. This repository contains the frontend code for the LangEdge platform.

## Features

- **AI-powered Translation**: Utilize advanced language models for accurate translations
- **User-friendly Interface**: Clean, intuitive design for optimal user experience
- **Responsive Design**: Fully functional across desktop and mobile devices
- **Multiple Language Support**: Translate between various languages

## Links

- **Live Website**: [langedge.kritapas.dev](https://langedge.kritapas.dev)
- **UI Design**: [Figma Design](https://www.figma.com/design/vBjx4ndDeEN2gsqUiAExXl/LangEdge-AI?node-id=0-1&t=pK12BDustvrseLDf-1)
- **Backend Repository**: [LangEdge-Backend](https://github.com/KritapasSuwannawin/LangEdge-Backend)

## Tech Stack

- **Framework**: React.js with TypeScript
- **State Management**: Redux Toolkit
- **Authentication**: Firebase
- **Styling**: CSS/SCSS
- **Deployment**: Cloudflare Pages

## Architecture

This project follows **Feature-Sliced Design (FSD)** methodology to ensure a scalable and maintainable frontend. The codebase is organized into strict layers where dependencies only flow downwards:

- `app/` — Global setup, routing, store configuration, and app-level providers.
- `pages/` — Route-level UI composition.
- `widgets/` — Complex composite UI blocks used across pages.
- `features/` — Moduler user interactions and distinct business functionality (e.g., auth actions).
- `entities/` — Core business entities, their state, and focused UI components (e.g., user, language).
- `shared/` — Reusable components, generic API clients, and project-wide utilities.

## Roadmap / Future Plans

1. **Text-to-Speech Implementation**: Add voice output for translated content
2. **Translation History**: Save and manage previous translations
3. **Premium Features**: Implement paid plans for access to more advanced LLMs

## Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables
4. Start the development server:

```bash
pnpm dev
```

## Building for Production

```bash
pnpm build
```

## Type Checking

```bash
pnpm typecheck
```

## Copyright

© 2025 Kritapas Suwannawin. All rights reserved.
