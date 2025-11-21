# Contributing to Fintech Wallet System

First off, thank you for considering contributing to Fintech Wallet System! It's people like you that make this project better.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if applicable**
- **Note your environment** (OS, Node version, browser, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure nothing breaks
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

#### Pull Request Guidelines

- Follow the existing code style
- Write clear, descriptive commit messages
- Include tests for new features
- Update documentation as needed
- Keep PRs focused - one feature per PR
- Ensure all tests pass
- Update the README if needed

## Development Setup

### Prerequisites

- Node.js v16+
- MongoDB v4.4+
- Git

### Setup

1. Clone your fork:
```bash
git clone https://github.com/your-username/FINTECH-WALLET-SYSTEM.git
cd FINTECH-WALLET-SYSTEM
```

2. Install backend dependencies:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## Coding Standards

### JavaScript/TypeScript

- Use ES6+ features
- Use async/await over callbacks
- Use meaningful variable names
- Comment complex logic
- Follow existing code style
- Use TypeScript types properly

### Backend Standards

- Follow RESTful API conventions
- Use proper HTTP status codes
- Validate all inputs
- Handle errors gracefully
- Write descriptive error messages
- Use middleware for cross-cutting concerns

### Frontend Standards

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript for type safety
- Handle loading and error states
- Make UI responsive
- Follow accessibility best practices

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Documentation

- Update README.md for significant changes
- Document new API endpoints in API_DOCUMENTATION.md
- Add JSDoc comments for complex functions
- Update deployment guide if needed

## Commit Messages

Follow the conventional commits specification:

- `feat: add new feature`
- `fix: fix bug in feature`
- `docs: update documentation`
- `style: format code`
- `refactor: refactor code`
- `test: add tests`
- `chore: update dependencies`

Examples:
```
feat: add password reset functionality
fix: resolve transaction race condition
docs: update API documentation for wallet endpoints
```

## Branch Naming

- Feature: `feature/feature-name`
- Bug fix: `fix/bug-name`
- Documentation: `docs/doc-name`
- Refactor: `refactor/refactor-name`

## Review Process

1. All PRs require at least one review
2. Address review comments promptly
3. Keep discussions professional and constructive
4. Be open to feedback

## Community

- Be respectful and inclusive
- Help others when you can
- Share knowledge and best practices
- Celebrate contributions

## Questions?

Feel free to reach out:
- Open an issue for questions
- Join our community discussions
- Email: dev@finwallet.com

Thank you for contributing! 🎉
