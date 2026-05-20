# Testing

This repo uses layered testing. The default choice should be the smallest layer
that can prove the behavior users care about.

## Test Layers

### Unit and Component Tests

Use Vitest with Testing Library for component-local behavior.

Good candidates:

- accessible roles, labels, and descriptions
- controlled input behavior
- validation timing
- blur and focus behavior
- disabled states
- submit/reset behavior
- user-visible messages

Use these tools:

- `@testing-library/react`
- `@testing-library/user-event`
- `prepareSetup` from `@ordero/test-config/react`
- Vitest globals such as `describe`, `it`, `expect`, and `vi`

For component tests across `apps` and `packages`, default to `prepareSetup`
when the file has repeated default props or a stable wrapper. Treat ad hoc
render helpers as the exception, not the default.

Use plain `render(...)` directly only when a one-off test is clearer because it
needs surrounding structure such as a form, extra focus targets, or similar
test-local setup.

Do not import Vitest globals in individual test files. App and package
TypeScript configs should expose them through a local Vitest shim.

For `input[type="password"]`, prefer `getByLabelText(...)` in jsdom tests.
Password inputs do not expose the same role behavior in Testing Library that
they do in a real browser.

### Storybook Browser Tests

Use Storybook Vitest tests for shared UI stories in `packages/ui`.
This section is only the high-level testing split; detailed shared UI
accessibility expectations live in `docs/accessibility-testing.md`.

Good candidates:

- shared component states documented in stories
- browser-backed accessibility checks
- visual state combinations that matter for shared controls

Run:

```bash
pnpm --dir packages/ui test:storybook
```

See `docs/accessibility-testing.md` for the shared UI accessibility workflow.

### Playwright E2E Tests

Use Playwright Test for routed app flows and browser integration.

Good candidates:

- page smoke tests
- auth and form flows
- backend or submit error mapping
- multi-component workflows
- behavior that depends on the real browser page

Do not use Playwright as the default layer for component-local behavior such as
field blur timing. Cover that with unit/component tests instead.

When an E2E test mocks an app-owned request with `page.route()` or
`context.route()`, register the route before the user action that triggers it.
If the request contract is part of the behavior under test, wait for the request
and assert stable details such as method and JSON body.

## Commands

Run all unit tests through Turbo:

```bash
pnpm test
```

Run app unit tests directly:

```bash
pnpm --dir apps/platform test
pnpm --dir apps/store test
```

Run a specific app unit test file:

```bash
pnpm --dir apps/platform test src/features/log-in/LogInForm.test.tsx
```

Run all app E2E tests through Turbo:

```bash
pnpm test:e2e
```

Run E2E tests only for affected packages:

```bash
pnpm test:e2e:affected
```

Run one app's E2E suite:

```bash
pnpm --dir apps/platform test:e2e
pnpm --dir apps/store test:e2e
```

Run a specific E2E file:

```bash
pnpm --dir apps/platform test:e2e:file e2e/LogInForm.spec.ts
pnpm --dir apps/store test:e2e:file e2e/Home.spec.ts
```

Run E2E tests by title:

```bash
pnpm --dir apps/platform test:e2e:grep "keeps the email"
pnpm --dir apps/store test:e2e:grep "renders the starter page"
```

Pass extra Playwright flags after the script arguments when needed:

```bash
pnpm --dir apps/platform test:e2e:file e2e/LogInForm.spec.ts --project=chromium
```

## App Test Setup

Each app should have:

- `vitest.config.ts`
- `vitest.setup.ts`
- `vitest.shims.d.ts`
- `playwright.config.ts`
- app-local `test:e2e`, `test:e2e:file`, `test:e2e:grep`, and `test:e2e:ui` scripts

Vitest config should merge `baseTestConfig` from `@ordero/test-config` and
exclude `e2e/**` so Vitest does not collect Playwright specs.

Example:

```ts
import { baseTestConfig } from '@ordero/test-config';
import { configDefaults, mergeConfig } from 'vitest/config';

export default mergeConfig(baseTestConfig, {
  test: {
    exclude: [...configDefaults.exclude, 'e2e/**'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});
```

The app shim should expose Vitest globals:

```ts
/// <reference types="vitest/globals" />
```

Add the shim to the app `tsconfig.json` `include` list.

Each app Playwright config should use a unique port so Turbo can run app E2E
tasks in parallel. Current ports:

- `apps/platform`: `127.0.0.1:3000`
- `apps/store`: `127.0.0.1:3001`

## Turbo E2E Graph

The root `test:e2e` task is app-aware through Turbo. Each app owns its own
`test:e2e` script, and root `pnpm test:e2e` runs those scripts in package
context.

The Turbo task depends on dependency builds plus each app's typecheck and unit
tests before running E2E:

```json
"test:e2e": {
  "dependsOn": ["^build", "typecheck", "test"],
  "cache": false
}
```

Use `pnpm test:e2e:affected` in pull request workflows when only changed apps
and their dependents should run.

## Playwright CLI

`@playwright/cli` is installed for local and agent-assisted browser
exploration. It is not the CI runner.

Use it to inspect the real page, generate locators, and debug interactions:

```bash
pnpm exec playwright-cli open http://127.0.0.1:3000/log-in --headed
pnpm exec playwright-cli snapshot
pnpm exec playwright-cli generate-locator e19 --raw
```

Use Playwright Test for committed E2E tests and CI:

```bash
pnpm test:e2e
```

## Form Testing

Feature forms should use unit/component tests for field-level UX rules:

- do not show client validation errors on the first keystroke
- show client validation errors after the user has blurred the field once
- once a field has been revealed as invalid, update its validity live while the
  user corrects it
- always show submit or backend field errors after submit

Use Playwright for the routed form flows that prove browser integration and
submit behavior on the real page.
