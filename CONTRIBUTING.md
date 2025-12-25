# Contributing to Persian Number Input

First off, thank you for considering contributing to Persian Number Input! It's people like you that make this library better for the entire Persian and Arabic developer community.

## 🌟 We Love Your Input!

We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Guidelines](#coding-guidelines)
- [Commit Messages](#commit-messages)
- [Issue Guidelines](#issue-guidelines)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please be respectful, inclusive, and considerate of others.

### Our Standards

✅ **Do:**
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

❌ **Don't:**
- Use sexualized language or imagery
- Troll, insult, or make derogatory comments
- Harass others publicly or privately
- Publish others' private information without permission
- Conduct yourself unprofessionally

---

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Type '....'
4. See error

**Expected behavior**
A clear description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Windows 10, macOS 13]
 - Browser: [e.g. Chrome 120, Firefox 121]
 - React Version: [e.g. 18.2.0]
 - Package Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title** describing the enhancement
- **Detailed description** of the proposed functionality
- **Use cases** showing why this would be useful
- **Possible implementation** if you have ideas

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- `good-first-issue` - Issues which should only require a few lines of code
- `help-wanted` - Issues which may be more involved
- `documentation` - Help improve our docs

---

## 💻 Development Setup

### Prerequisites

- Node.js 16.x or higher
- npm, yarn, or pnpm
- Git

### Getting Started

1. **Fork the repository**

Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

```bash
git clone https://github.com/YOUR_USERNAME/persian-number-input.git
cd persian-number-input
```

3. **Add upstream remote**

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/persian-number-input.git
```

4. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

5. **Create a branch**

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Project Structure

```
persian-number-input/
├── src/
│   ├── components/          # React components
│   │   └── PersianNumberInput.tsx
│   ├── hooks/              # Custom React hooks
│   │   └── usePersianNumberInput.ts
│   ├── utils/              # Utility functions
│   │   ├── digitUtils.ts
│   │   └── transformNumber.ts
│   └── index.ts            # Main entry point
├── examples/               # Example usage
├── tests/                  # Test files
├── docs/                   # Documentation
└── package.json
```

### Running Tests

```bash
npm test
# or
npm run test:watch
```

### Building the Project

```bash
npm run build
```

### Running Examples Locally

```bash
npm run dev
# or
npm run examples
```

---

## 🔄 Pull Request Process

### Before Submitting

- ✅ Test your changes thoroughly
- ✅ Update documentation if needed
- ✅ Add tests for new features
- ✅ Ensure all tests pass
- ✅ Follow the coding guidelines
- ✅ Update CHANGELOG.md if applicable

### Submitting a Pull Request

1. **Update your fork**

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

2. **Rebase your branch**

```bash
git checkout feature/your-feature-name
git rebase main
```

3. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

4. **Create Pull Request**

Go to the original repository and click "New Pull Request"

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
Describe the tests you ran to verify your changes.

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.
```

### Review Process

- Maintainers will review your PR within 3-5 business days
- Address any requested changes
- Once approved, a maintainer will merge your PR

---

## 🎨 Coding Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use trailing commas in multi-line objects/arrays
- Maximum line length: 100 characters

### Example:

```typescript
// ✅ Good
export const transformNumber = (
  rawValue: string | undefined,
  options?: TransformNumberOptions
): string => {
  const { locale = 'fa', separatorChar = ',' } = options || {};
  
  if (!rawValue) {
    return '';
  }
  
  return formatValue(rawValue, locale);
};

// ❌ Bad
export const transformNumber = (rawValue: any, options: any) => {
    if(!rawValue) return ""
    return formatValue(rawValue, options.locale)
}
```

### React Best Practices

- Use functional components with hooks
- Avoid unnecessary re-renders (use `useMemo`, `useCallback`)
- Keep components small and focused
- Props should be well-typed with interfaces

### Performance

- Avoid unnecessary computations
- Use memoization where appropriate
- Consider bundle size impact

---

## 💬 Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(input): add support for negative numbers

Add ability to handle negative numbers with proper formatting
and locale-specific minus sign positioning.

Closes #123

---

fix(utils): correct decimal separator handling

Fixed bug where custom decimal separators were not being
properly applied in Arabic locale.

Fixes #456

---

docs(readme): update installation instructions

Added pnpm installation option and improved quick start guide.
```

---

## 🐛 Issue Guidelines

### Creating Issues

When creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use a clear title** that describes the issue
3. **Provide details** using the appropriate template
4. **Add labels** if you have permission
5. **Be respectful** and constructive

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good-first-issue` - Good for newcomers
- `help-wanted` - Extra attention is needed
- `question` - Further information is requested
- `wontfix` - This will not be worked on
- `duplicate` - This issue already exists

---

## 🌍 Translation Contributions

We welcome translations! To add or improve translations:

1. Check existing locale files in `src/locales/`
2. Add or update translations following the same structure
3. Test the translations in the examples
4. Submit a PR with your changes

---

## 📚 Documentation

Documentation improvements are always welcome! This includes:

- README improvements
- API documentation
- Code comments
- Usage examples
- Tutorial content

---

## 🎁 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- GitHub contributors page

---

## 📞 Questions?

- 💬 Join our [Discussions](https://github.com/USERNAME/persian-number-input/discussions)
- 📧 Email: mohammadjavadsharifi98@gmail.com
- 🐛 Open an [Issue](https://github.com/USERNAME/persian-number-input/issues)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing! 🎉**
