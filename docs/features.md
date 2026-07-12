# Feature Structure

App features live under `apps/*/src/features/[feature]`. Keep each feature
organized around user-facing workflows and public entrypoints, not around file
types alone.

## Workflow Folders

Split resource features by logical workflow once they contain more than one
screen, dialog, or action:

```txt
features/products/
├── index.ts
├── list/
│   ├── ProductsList/
│   │   ├── ProductsList.tsx
│   │   ├── ProductsListHeader.tsx
│   │   ├── columns.tsx
│   │   ├── types.ts
│   │   ├── ProductsList.test.tsx
│   │   └── index.ts
│   └── CreateProduct/
│       ├── CreateProduct.tsx
│       ├── hooks/
│       ├── utils/
│       ├── constants.ts
│       ├── types.ts
│       └── index.ts
└── detail/
    ├── ProductDetail/
    ├── UpdateProduct/
    └── DeleteProduct/
```

Use domain-specific names, but keep the split meaningful:

- `list/` for list pages, list headers, list table columns, filters, and create
  actions launched from the list workflow.
- `detail/` for detail pages and actions that operate on an existing entity.
  If an existing feature already uses `details/`, keep that feature consistent.
- `add/` or `CreateX/` for standalone create pages or create workflows. Prefer
  the naming already used by the neighboring feature.
- `shared/` for feature-local pieces reused by multiple workflows inside the
  same feature.

Small single-purpose features can stay flat while that remains clearer. Split
when unrelated workflow state, table configuration, form setup, action dialogs,
or detail-only logic starts competing in the same folder.

## Public Entrypoints

Every feature folder should have a root `index.ts` that exports only the public
components or types that routes and other features are allowed to consume.
Internal hooks, submit actions, validation helpers, constants, table columns,
and private subcomponents should stay behind the workflow/component folder that
owns them.

Every public component folder should also have a local `index.ts`:

```ts
export { ProductsList } from './ProductsList';
export { ProductsListHeader } from './ProductsListHeader';
```

Prefer this import flow:

- App routes import from the feature root, such as `@/features/products`.
- A feature root barrel re-exports from workflow/component barrels, such as
  `@/features/products/list/ProductsList`.
- Components inside one folder use local relative imports for private files,
  such as `./types`, `./columns`, `./hooks/useCreateProductForm`, or
  `./utils/validations`.
- Cross-workflow feature imports should use the nearest public barrel for the
  workflow being consumed, not a deep private component file.

Tests for pages and other consumers should mock the same public entrypoint the
consumer imports. When partially mocking a multi-export feature barrel, preserve
adjacent exports with inline async `vi.importActual`.

## Component Types

Keep component-related types in the component folder's `types.ts`.

Use `types.ts` for:

- component prop types, named `type [ComponentName]Props`
- component-local callback arg types
- table or field-section view models that belong to the component
- workflow dialog props that are not shared domain models

Do not use feature `types.ts` files as a dumping ground for shared API or domain
contracts. If lower-level app code and multiple features need the same domain
shape, move it to an app-owned shared domain module such as
`src/lib/domain/[resource].ts`. Keep shared HTTP/auth contracts in
`@ordero/api-types`.

When a component has no props or component-owned types, a `types.ts` file is not
required just to satisfy the folder shape.

When refactoring feature folders, verify that component props did not remain
inline in feature components:

```sh
rg "^type [A-Za-z0-9]+Props" apps/platform/src/features apps/store/src/features -n
```

Move any matches that are component-owned props into the nearest local
`types.ts`.
