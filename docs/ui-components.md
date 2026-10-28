# UI Components

## Shared Component Shape

Shared UI components live in `packages/ui/src/components/[ComponentName]` and should keep their public API explicit.

Use this base structure:

- `[ComponentName].tsx` for the root component implementation
- `types.ts` for exported prop types
- `index.ts` for the public component entrypoint
- `[ComponentName].test.tsx` next to the component it covers
- `packages/ui/stories/[ComponentName].stories.tsx` for Storybook states
- `styles.css` in the component folder only when Tailwind class strings are not enough

Export shared components from `packages/ui/src/index.ts` so apps can consume them through `@ordero/ui`.

## Compound Components

For components with multiple public parts, use the Base UI-style namespace pattern.

The public API should look like this:

```tsx
<Component.Root>
  <Component.Left />
  <Component.Right />
</Component.Root>
```

Use `index.parts.ts` to map implementation names to public part names:

```ts
// packages/ui/src/components/Component/index.parts.ts
export { ComponentRoot as Root } from './Component';
export { ComponentLeft as Left } from './ComponentLeft';
export { ComponentRight as Right } from './ComponentRight';
```

Then export the namespace from the component entrypoint:

```ts
// packages/ui/src/components/Component/index.ts
export * as Component from './index.parts';
export type {
  ComponentLeftProps,
  ComponentProps,
  ComponentRightProps,
} from './types';
```

The root component file should export the root implementation by name:

```tsx
export const ComponentRoot = ({ children }: ComponentProps) => (
  <section>{children}</section>
);
```

The package barrel should export only the namespace and public prop types:

```ts
export type {
  ComponentLeftProps,
  ComponentProps,
  ComponentRightProps,
} from './components/Component';
export { Component } from './components/Component';
```

Avoid new `Object.assign(root, { Part })` compound APIs unless backward compatibility requires the callable shorthand:

```tsx
<Component>
  <Component.Part />
</Component>
```

Do not use the namespace pattern for single-part components such as `Button`, `Input`, `IconButton`, or `Chip`.

## Card Variants and Colors

`Card.Root` separates surface treatment (`variant`) from semantic color
(`color`). Existing cards default to `variant="filled"` and `color="inherit"`.

| Variant | Surface | Elevation |
| --- | --- | --- |
| `filled` | Paper background with a subtle tint when a color is selected. | Standard Card shadow. |
| `outlined` | Paper background with a neutral or semantic colored border. | No shadow. |

Colors are `inherit`, `primary`, `secondary`, `info`, `success`, `warning`, and
`error`, matching the existing design-system palette. `inherit` keeps the
neutral surface. Colored fills use the existing 8% color tokens over the paper
background; outlines use the 20% color tokens. Text retains the standard Card
foreground, and the existing radius and content spacing apply to every color.

Use the shared API for colored cards instead of styling a custom container:

```tsx
<Card.Root color="primary">
  <Card.Content>Inventory value</Card.Content>
</Card.Root>
```

Include text explaining any status conveyed by color. The Card stories show
both variants across the palette in light and dark themes.

## Stories And Tests

Stories and tests should document the public API. For compound components, examples should use the namespace form consumers will use, such as `TopBar.Root`, `TopBar.Left`, and `TopBar.Right`.
