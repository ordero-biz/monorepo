import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EllipsisVertical } from 'lucide-react';
import { Menu } from './index';
import type { MenuRootProps } from './types';

const menuChildren = (
  <>
    <Menu.Trigger aria-label="Open menu options">Options</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup maxHeight="280px">
          <Menu.Item>Edit</Menu.Item>
          <Menu.Item>Duplicate</Menu.Item>
          <Menu.Item disabled={true}>Delete</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </>
);

const iconButtonMenuChildren = (
  <>
    <Menu.Trigger appearance="iconButton" aria-label="More actions">
      <EllipsisVertical aria-hidden="true" />
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item>Archive</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </>
);

describe('Menu', () => {
  const { setup } = prepareSetup<MenuRootProps>({
    component: Menu.Root,
    props: {
      children: menuChildren,
    },
  });

  const { setup: setupIconButtonMenu } = prepareSetup<MenuRootProps>({
    component: Menu.Root,
    props: {
      children: iconButtonMenuChildren,
    },
  });

  it('opens its items from the trigger', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole('button', { name: 'Open menu options' })
    );

    expect(await screen.findByRole('menu')).toBeInTheDocument();
    expect(
      await screen.findByRole('menuitem', { name: 'Edit' })
    ).toBeInTheDocument();
  });

  it('closes after users choose an item', async () => {
    const user = userEvent.setup();
    const { onOpenChange } = setup({
      onOpenChange: vi.fn(),
    });

    await user.click(
      screen.getByRole('button', { name: 'Open menu options' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Duplicate' })
    );

    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keeps disabled items unavailable', async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getByRole('button', { name: 'Open menu options' })
    );

    expect(
      await screen.findByRole('menuitem', { name: 'Delete' })
    ).toHaveAttribute('aria-disabled', 'true');
  });

  it('disables its trigger when the menu root is disabled', () => {
    setup({ disabled: true });

    expect(
      screen.getByRole('button', { name: 'Open menu options' })
    ).toBeDisabled();
  });

  it('opens from an icon button trigger', async () => {
    const user = userEvent.setup();

    setupIconButtonMenu();

    await user.click(screen.getByRole('button', { name: 'More actions' }));

    expect(
      await screen.findByRole('menuitem', { name: 'Archive' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'More actions' }));

    expect(
      screen.queryByRole('menuitem', { name: 'Archive' })
    ).not.toBeInTheDocument();
  });
});
