# `prepareSetup` Example

Use `prepareSetup` from `@ordero/test-config/react` when a test file has repeated default props and benefits from a shared setup helper.

Strict rule: when a `prepareSetup` test overrides a prop and later asserts on that prop, destructure the asserted prop from the object returned by `setup(...)`. Do not keep a separate local variable for the same overridden prop.

```tsx
import { prepareSetup } from '@ordero/test-config/react';

const { setup } = prepareSetup<ButtonProps & { children: string }>({
  component: Button,
  props: {
    children: 'test label',
    onClick: vi.fn(),
    startIcon: <span aria-hidden="true">star</span>,
    endIcon: <span aria-hidden="true">end icon</span>,
  },
});

it('calls the click handler when enabled', async () => {
  const user = userEvent.setup();

  const { children, onClick } = setup({ children: 'Click me', onClick: vi.fn() });

  await user.click(screen.getByRole('button', { name: children }));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

Use plain `render(...)` directly when a one-off test is simpler than introducing shared setup, for example when a test needs an enclosing form or extra focus targets.
