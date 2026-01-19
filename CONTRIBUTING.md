# Contributing to @omni-door/cli

First off, thank you for considering contributing to @omni-door/cli! It's people like you that make this project better.

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code snippets, configuration files)
- **Describe the behavior you observed and what you expected**
- **Include your environment details**:
  - Node.js version (`node -v`)
  - npm/yarn/pnpm version
  - Operating system
  - @omni-door/cli version (`omni -v`)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `master`
2. **Install dependencies**: `yarn install`
3. **Make your changes**
4. **Run linting**: `npm run lint`
5. **Run tests**: `npm test`
6. **Commit your changes** following the commit message conventions below
7. **Push to your fork** and submit a pull request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cli.git
cd cli

# Install dependencies
yarn install

# Run linting
npm run lint

# Run tests
npm test

# Build the project
npm run build
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/). Each commit message should have a type:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(init): add Vue 3 project template
fix(dev): resolve HMR not working on Windows
docs: update README installation instructions
```

## Project Structure

```
src/
├── commands/       # CLI commands (init, dev, build, etc.)
│   ├── build/
│   ├── dev/
│   ├── initial/
│   ├── new/
│   ├── release/
│   ├── servers/
│   └── start/
├── utils/          # Shared utilities
└── @types/         # TypeScript type definitions
```

## Testing

- Tests are located in `__test__` directories alongside the code they test
- We use Mocha + Chai for testing
- Run tests with `npm test`
- Run tests with coverage with `npm test` (NYC is configured)

## Style Guide

- We use TypeScript with strict mode
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Run `npm run lint:fix` to auto-fix style issues

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing!
