# Accessibility Focus Hooks

The store app keeps reusable focus behavior in
[`apps/store/src/lib/hooks/accessibility`](../apps/store/src/lib/hooks/accessibility).
These hooks handle entering an inline editor and returning to its trigger.
They use DOM refs and rendered accessibility attributes; they do not depend on
TanStack Form, product fields, or validation schemas.

## Choose the hook

| Interaction | Hook | Attach the returned ref to |
| --- | --- | --- |
| Enter a newly mounted editor | `useInitialFocus()` | The wrapper containing its controls |
| Open an editor with field errors | `useInitialFocus({ preferInvalid: true })` | The wrapper containing its controls |
| Return from an editor to its trigger | `useRestoreFocus(isOpen)` | The trigger button |

Use these hooks for app-owned focus behavior. Before adding them to a dialog,
popover, or other shared component, check whether that component already owns
initial focus and restoration. Configure its existing focus API when available
so two mechanisms do not compete.

The hooks currently belong to `apps/store`. Another app should not import from
the store's source tree. If a second app needs the same behavior, consider
moving the implementation to a shared package with its tests.

## Initial focus

```tsx
import { useInitialFocus } from '@/lib/hooks/accessibility/useInitialFocus';

const DetailsEditor = () => {
  const editorRef = useInitialFocus({ preferInvalid: true });

  return (
    <div ref={editorRef}>
      <label>
        Product name
        <input name="name" />
      </label>
      <label>
        Description
        <textarea name="description" />
      </label>
    </div>
  );
};
```

`useInitialFocus<T>({ preferInvalid?: boolean })` returns a nullable DOM ref.
The default element type is `HTMLDivElement`. Use a type argument when needed,
for example `useInitialFocus<HTMLFormElement>()` for an actual form wrapper.
Do not introduce a nested form solely to attach this ref.

The hook schedules one scan on the next animation frame after its mount effect.
This lets initial validation effects render their errors before a control is
chosen. It cancels the scheduled scan on cleanup. Ordinary rerenders do not
schedule another scan; changing `preferInvalid` does.

During the scan, it:

1. Preserves focus if it is already inside the wrapper.
2. Collects candidate controls in DOM order: inputs other than hidden inputs,
   selects, textareas, buttons, links with an `href`, and elements with
   `tabindex` or `contenteditable="true"`.
3. Skips negative `tabIndex` values, disabled controls, descendants of hidden,
   inert, or `aria-disabled="true"` elements, and controls reported invisible
   by `checkVisibility` when the browser supports it.
4. When `preferInvalid` is true, tries controls marked `aria-invalid="true"`
   or inside an invalid ancestor within the wrapper, in DOM order.
5. Falls back to the first eligible control if no invalid control can receive
   focus. Each attempt verifies that the browser actually moved focus.

This is an initial-focus helper for ordinary app controls, not a complete
browser tab-order algorithm. Keep DOM order aligned with reading order and use
the controls' normal keyboard behavior rather than positive `tabIndex` values.
For composite widgets, expose the intended tab stop through the widget's API.

### Invalid fields and groups

Set the shared control's `invalid` and `errorText` props from the form's errors.
The rendered control or its group must expose `aria-invalid="true"` for the
hook to prioritize it. A group such as a radio group can carry the invalid
state while its selected radio receives focus.

The hook does not validate values, read form metadata, open an editor, or show
error messages. Those remain responsibilities of the form and workflow.
The workflow decides whether a validation failure should open an editor;
the hook then focuses an eligible control using the rendered invalid state.

### Mounting and asynchronous content

Keep the wrapper and its initial controls mounted when the effect runs.
Conditionally mount the editor when it opens. Toggling CSS visibility on an
already mounted editor does not rerun this hook. Likewise, mounting a wrapper
later inside a component whose hook has already run will not trigger a scan.

The scan does not wait for network requests or observe later DOM changes. If
controls arrive asynchronously, mount the component that calls the hook once
those controls are ready. Errors arriving after the initial scan do not move
focus automatically. Portaled controls outside the wrapper are outside its
search scope. The hook does not trap focus or implement dialog semantics.

## Restore focus to the trigger

```tsx
import { useState } from 'react';
import { useRestoreFocus } from '@/lib/hooks/accessibility/useRestoreFocus';

const ProductDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const editButtonRef = useRestoreFocus<HTMLButtonElement>(isEditing);

  return (
    <section aria-label="Product details">
      {isEditing ? (
        <button type="button" onClick={() => setIsEditing(false)}>
          Cancel editing
        </button>
      ) : (
        <button
          ref={editButtonRef}
          type="button"
          onClick={() => setIsEditing(true)}
        >
          Edit details
        </button>
      )}
    </section>
  );
};
```

`useRestoreFocus<T>(isOpen: boolean)` returns a nullable ref for the trigger.
Its default element type is `HTMLElement`, which also suits shared components
whose ref API uses that type.

Call it in the workflow component that remains mounted while the editor opens
and closes. It focuses the referenced element only when `isOpen` transitions
from `true` to `false`. It does not focus on initial render, opening, or repeated
closed renders. Closing an initially open editor also restores focus.

The trigger can unmount while editing, provided it remounts in the same commit
that closes the editor. It must exist and be focusable when the effect runs.
A missing ref is a no-op; the hook does not wait for a delayed trigger, select a
fallback, or remember a different previously focused element. Unmounting the
entire workflow does not restore focus; route navigation owns that transition.

## Use both in an inline editing flow

Keep `useRestoreFocus(isEditing)` in the persistent summary/workflow component.
Keep `useInitialFocus({ preferInvalid: true })` in the conditionally mounted
editor. Attach the first ref to **Edit details** and the second to the editor's
wrapper. Close editing after valid Apply or Cancel; failed validation keeps
the editor open.

The working example is
[`CommonProductData`](../apps/store/src/features/products/add2/CreateProduct/CommonProductData.tsx)
and its child
[`ProductDetailsEditor`](../apps/store/src/features/products/add2/CreateProduct/ProductDetailsEditor.tsx).
Field ordering and field names do not need a parallel focus-ref list.

## Verify behavior

Use accessible role/name queries and `toHaveFocus()` assertions. For initial
focus, use `waitFor` in component tests because the scan is scheduled. Hook
tests may advance an animation frame inside `act` when using fake timers.
Use the app's `prepareStoreSetup` helper for reusable test fixtures.

Relevant cases include entering the editor, prioritizing invalid fields and
groups, skipping unavailable controls, preserving focus during rerenders,
and returning to the trigger after Apply or Cancel. When replacing controls
with mocks, preserve their relevant accessibility attributes.

Use a browser test for behavior that depends on actual CSS visibility, layout,
portals, or composition with an overlay. JSDOM focus assertions alone do not
verify browser visibility checks. See [Accessibility Testing](accessibility-testing.md)
and [Form Architecture](forms.md) for the surrounding conventions.

From the repository root:

```sh
pnpm --dir apps/store exec vitest run src/lib/hooks/accessibility/useInitialFocus.test.tsx src/lib/hooks/accessibility/useRestoreFocus.test.tsx src/features/products/add2/CreateProduct/CreateProduct.test.tsx
pnpm --dir apps/store exec tsc --noEmit
```
