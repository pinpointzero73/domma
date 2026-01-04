# Domma Testing Guide

This document outlines the testing strategy and guidelines for the Domma framework.

## Test Structure

Domma uses two complementary testing frameworks:

### 1. Vitest - Unit Tests

**Purpose:** Fast, isolated tests for individual modules and functions

**Location:** `src/*.test.js` (co-located with source files)

**Test Files:**

- `src/dom.test.js` - DOM manipulation methods
- `src/utils.test.js` - Utility functions
- `src/dates.test.js` - Date manipulation
- `src/models.test.js` - Reactive models & pub/sub
- `src/elements.test.js` - UI components
- `src/tables.test.js` - DataTable functionality
- `src/storage.test.js` - localStorage wrapper
- `src/http.test.js` - HTTP client
- `src/theme.test.js` - Theme management
- `src/icons.test.js` - SVG icon system

**Configuration:**

- `vitest.config.js` - Vitest configuration
- `tests/setup-vitest.js` - JSDOM setup and mocks

### 2. Cypress - End-to-End Tests

**Purpose:** Integration tests that verify complete user workflows in a real browser

**Location:** `cypress/e2e/*.cy.js`

**Test Files:**

- `cypress/e2e/spec.cy.js` - Main E2E test suite

**Configuration:**

- `cypress.config.js` - Cypress configuration

## Running Tests

### Run All Unit Tests

```bash
npm test
# or
npm run test:vitest
```

### Run Unit Tests in Watch Mode

```bash
npm test -- --watch
```

### Run Specific Test File

```bash
npm test -- src/elements.test.js
```

### Run E2E Tests

```bash
npm run cypress:run
```

### Open Cypress Interactive Mode

```bash
npx cypress open
```

## Writing Unit Tests

### Test Structure

```javascript
import {describe, it, expect, beforeEach, afterEach} from 'vitest';
import Domma from './index.js';

describe('Component Name', () => {
  let testContainer;

  beforeEach(() => {
    testContainer = document.createElement('div');
    testContainer.id = 'test-container';
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.replaceChildren();
    testContainer = null;
  });

  it('should do something', () => {
    // Arrange - Create test element
    const testDiv = document.createElement('div');
    testDiv.id = 'test';
    testContainer.appendChild(testDiv);

    // Act
    const result = Domma('#test').addClass('active');

    // Assert
    expect(result.hasClass('active')).toBe(true);
  });
});
```

### Testing Elements with Timers

Elements that use animations or setTimeout require fake timers:

```javascript
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

describe('Animated Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should animate', async () => {
    const modal = Domma.elements.modal('#test-modal');

    modal.open();
    await vi.advanceTimersByTimeAsync(10);

    expect(modal.isOpen()).toBe(true);
  });
});
```

### Testing localStorage

The test environment provides a mocked localStorage:

```javascript
it('should persist data', () => {
  Domma.storage.set('key', 'value');
  expect(Domma.storage.get('key')).toBe('value');

  // Clear between tests
  Domma.storage.clear();
});
```

### Mocking HTTP Requests

The fetch API is mocked in `tests/setup-vitest.js`. Add new endpoints there:

```javascript
// In tests/setup-vitest.js
global.fetch = async (url, options) => {
  if (url === '/api/data' && options.method === 'GET') {
    return {
      ok: true,
      status: 200,
      json: async () => ({message: 'Success'})
    };
  }
  // ... other mock responses
};
```

## Writing E2E Tests

### Test Structure

```javascript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/path/to/page');
  });

  it('should perform user action', () => {
    cy.get('#element').click();
    cy.get('.result').should('contain', 'Expected Text');
  });
});
```

### Testing Collapsible Cards Example

```javascript
it('should toggle collapsible card', () => {
  const card = cy.get('#collapsible-demo');

  // Initially expanded
  card.should('not.have.class', 'card-collapsed');

  // Click to collapse
  card.find('.card-header').click();
  card.should('have.class', 'card-collapsed');

  // Click to expand
  card.find('.card-header').click();
  card.should('not.have.class', 'card-collapsed');
});
```

### Testing localStorage Persistence

```javascript
it('should persist state', () => {
  cy.get('#card').find('.card-header').click();
  cy.get('#card').should('have.class', 'card-collapsed');

  // Reload page
  cy.reload();

  // Should still be collapsed
  cy.get('#card').should('have.class', 'card-collapsed');
});
```

## Test Coverage

### Current Coverage

Unit tests cover:

- ✅ DOM manipulation API
- ✅ Utility functions
- ✅ Date manipulation
- ✅ Reactive models
- ✅ UI elements (Modal, Tabs, Accordion, Tooltip, Card, etc.)
- ✅ DataTables
- ✅ Storage wrapper
- ✅ HTTP client
- ✅ Theme management
- ✅ Icon system

E2E tests cover:

- ✅ Homepage navigation
- ✅ Card showcase (including collapsible cards)
- ✅ Modal showcase
- ✅ Theme switching
- ✅ Responsive navigation

### Adding New Tests

When adding a new feature:

1. **Write unit tests** in the corresponding `*.test.js` file
2. **Test all methods** and edge cases
3. **Add E2E test** if the feature affects user workflows
4. **Run tests** to ensure they pass: `npm test`
5. **Update this README** if adding new test patterns

## Best Practices

### DO ✅

- **Use descriptive test names** that explain what is being tested
- **Follow AAA pattern** (Arrange, Act, Assert)
- **Test edge cases** and error conditions
- **Mock external dependencies** (HTTP, timers, localStorage)
- **Clean up after tests** (reset DOM, clear storage)
- **Use fake timers** for animations and delays
- **Test accessibility** (keyboard navigation, ARIA attributes)
- **Use safe DOM methods** in test setup (createElement, appendChild)

### DON'T ❌

- Don't test implementation details, test behaviour
- Don't share state between tests
- Don't use real HTTP requests in unit tests
- Don't skip cleanup in afterEach hooks
- Don't test third-party library internals
- Don't use setTimeout in tests (use fake timers)

## Debugging Tests

### Vitest Debugging

```bash
# Run tests with detailed output
npm test -- --reporter=verbose

# Run a single test
npm test -- -t "test name"

# Debug with Chrome DevTools
node --inspect-brk ./node_modules/vitest/vitest.mjs
```

### Cypress Debugging

```bash
# Open interactive mode (best for debugging)
npx cypress open

# Run with screenshots on failure
npm run cypress:run

# Debug specific test
npx cypress run --spec "cypress/e2e/spec.cy.js"
```

### Common Issues

**Issue:** Tests fail due to timing

**Solution:** Use `vi.advanceTimersByTimeAsync()` or increase wait time

**Issue:** localStorage tests interfere with each other

**Solution:** Call `Domma.storage.clear()` in `afterEach`

**Issue:** DOM elements persist between tests

**Solution:** Clear DOM in `afterEach` hook

## CI/CD Integration

Tests run automatically on:

- ✅ Pre-commit hooks (via git hooks)
- ✅ Pull request creation
- ✅ Main branch pushes

### Running Tests in CI

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests headless
npm run cypress:run
```

## Test Data

Test fixtures and mock data should be:

- **Minimal** - Only what's needed for the test
- **Realistic** - Representative of production data
- **Hardcoded** - No external dependencies
- **Safe** - Use DOM methods, not string concatenation

## Future Improvements

Planned testing enhancements:

- [ ] Visual regression testing for UI components
- [ ] Performance testing for large datasets
- [ ] Accessibility testing automation
- [ ] Cross-browser testing matrix
- [ ] Code coverage reporting
- [ ] Snapshot testing for component output

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
- [JSDOM Documentation](https://github.com/jsdom/jsdom)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Questions?

If you encounter issues or have questions about testing:

1. Check this README first
2. Look at existing tests for examples
3. Review test setup in `tests/setup-vitest.js`
4. Open an issue on GitHub
