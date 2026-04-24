# `prepareSetup` Example

Use `prepareSetup` from `@ordero/test-config/react` when a test file has repeated default props and benefits from a shared setup helper.

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
  const onClick = vi.fn();

  setup({ children: 'Click me', onClick });

  await user.click(screen.getByRole('button', { name: 'Click me' }));

  expect(onClick).toHaveBeenCalledTimes(1);
});
```

Use plain `render(...)` directly when a one-off test is simpler than introducing shared setup, for example when a test needs an enclosing form or extra focus targets.
