# UI Tokens

## Purpose

This project uses Figma variables as the source of truth for design tokens, then maps those tokens into a semantic layer that can be consumed consistently by shadcn components, Base UI primitives, and Tailwind 4 utilities.

The goal is to keep fidelity with the design system without forcing component code to depend directly on raw Figma token names.

## Token Layers

### 1. Raw Figma Tokens

Raw Figma tokens should be stored as `--figma-*` variables.

Examples:

```css
--figma-primary-main: #00a76f;
--figma-grey-500: #919eab;
--figma-radius-1: 8px;
```

These exist to preserve the original design-system values and make it easy to trace a token back to Figma.

### 2. Semantic App Tokens

Raw tokens should be mapped into a semantic token layer before components use them.

Examples:

```css
--primary: var(--figma-primary-main);
--border: var(--figma-grey-20);
--radius: var(--figma-radius-1);
```

This layer is what components should depend on. It gives the app stable, meaningful token names even if the raw Figma variables change later.

### 3. Tailwind Theme Tokens

Semantic tokens should be exposed to Tailwind 4 through `@theme inline`.

Examples:

```css
@theme inline {
  --color-primary: var(--primary);
  --color-border: var(--border);
  --color-background: var(--background);
}
```

This allows utilities like `bg-primary`, `border-border`, and `text-foreground` to stay aligned with the semantic design system.

## How shadcn and Base UI Fit In

Base UI provides accessible primitives and interaction behavior. It does not require a fixed visual design system.

shadcn components are mainly structural component code plus Tailwind classes. Those classes can point at this project’s semantic token layer instead of any default palette.

That means the architecture is:

1. Figma provides raw tokens.
2. The app maps them to semantic tokens.
3. Tailwind exposes those semantic tokens as utilities.
4. shadcn and Base UI components consume those semantic utilities.

## Recommended Rules

- Keep raw Figma tokens in a dedicated `--figma-*` layer.
- Do not style components directly with raw `--figma-*` tokens unless there is a specific reason.
- Prefer semantic tokens like `--background`, `--foreground`, `--primary`, `--border`, `--input`, `--ring`, and `--radius`.
- Keep the semantic layer stable even if raw Figma token names evolve.
- Export semantic tokens to Tailwind through `@theme inline`.
- Preserve shadcn compatibility by keeping the semantic token set that shadcn expects.

## Radius Guidance

For radius, the semantic shadcn token should be derived from the imported Figma radius scale rather than hardcoded values.

Example:

```css
--radius: var(--radius-1);
--radius-sm: var(--radius-0-5);
--radius-md: var(--radius-0-75);
--radius-lg: var(--radius-1);
--radius-xl: var(--radius-1-5);
```

This keeps the component radius behavior aligned with Figma while preserving shadcn’s expected semantic API.

## Why This Structure Is Useful

- It keeps the design system traceable back to Figma.
- It avoids coupling component code to literal Figma token names.
- It lets shadcn and Base UI work inside a project-specific design system.
- It makes Tailwind utilities reflect the semantic token model instead of a hardcoded palette.
- It gives the team one place to adjust theming without rewriting components.

## When to Add New Tokens

When importing new variables from Figma:

1. Add them to the raw `--figma-*` layer.
2. Decide whether they need an app-level semantic alias.
3. Expose them to Tailwind only if they need to be used in utility classes.
4. Prefer semantic naming for component usage.

## Short Version

- Raw Figma tokens for fidelity.
- Semantic tokens for components.
- Tailwind theme variables for ergonomics.
