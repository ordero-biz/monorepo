import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './index';
import type { TabsRootProps } from './types';

const tabContent = (
  <>
    <Tabs.List aria-label="Account">
      <Tabs.Tab value="profile">Profile</Tabs.Tab>
      <Tabs.Tab disabled value="billing">
        Billing
      </Tabs.Tab>
      <Tabs.Tab value="settings">Settings</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="profile">Your profile</Tabs.Panel>
    <Tabs.Panel value="billing">Your billing</Tabs.Panel>
    <Tabs.Panel value="settings">Your settings</Tabs.Panel>
  </>
);

describe('Tabs', () => {
  // Layout and overflow are covered in the browser-backed stories.
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  const { setup } = prepareSetup<TabsRootProps>({
    component: Tabs.Root,
    props: { defaultValue: 'profile', children: tabContent },
  });

  it('shows the default panel and switches to the selected tab', async () => {
    const user = userEvent.setup();
    setup();

    expect(screen.getByRole('tablist', { name: 'Account' })).toBeVisible();
    expect(screen.getByRole('tabpanel', { name: 'Profile' })).toHaveTextContent(
      'Your profile'
    );
    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(
      screen.getByRole('tabpanel', { name: 'Settings' })
    ).toHaveTextContent('Your settings');
    expect(screen.queryByRole('tabpanel', { name: 'Profile' })).toBeNull();
  });

  it('requests controlled changes without changing the supplied selection', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({
      value: 'profile',
      onValueChange: vi.fn(),
    });

    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(onValueChange).toHaveBeenCalledWith('settings', expect.any(Object));
    expect(screen.getByRole('tabpanel', { name: 'Profile' })).toBeVisible();
  });

  it('supports an explicitly empty selection', () => {
    setup({ value: null });
    expect(screen.queryByRole('tab', { selected: true })).toBeNull();
    expect(screen.queryByRole('tabpanel')).toBeNull();
  });

  it('selects the first enabled tab when no default value is supplied', () => {
    setup({
      defaultValue: undefined,
      children: (
        <>
          <Tabs.List aria-label="Account">
            <Tabs.Tab disabled value={0}>
              Billing
            </Tabs.Tab>
            <Tabs.Tab value={1}>Profile</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value={0}>Your billing</Tabs.Panel>
          <Tabs.Panel value={1}>Your profile</Tabs.Panel>
        </>
      ),
    });

    expect(screen.getByRole('tab', { selected: true })).toHaveAccessibleName(
      'Profile'
    );
    expect(screen.getByRole('tabpanel', { name: 'Profile' })).toBeVisible();
    expect(screen.queryByRole('tabpanel', { name: 'Billing' })).toBeNull();
  });

  it('prevents selection of a disabled tab', async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getByRole('tab', { name: 'Billing' }));
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    expect(screen.getByRole('tabpanel', { name: 'Profile' })).toBeVisible();
  });

  it('keeps disabled tabs discoverable and requires activation after arrow-key focus', async () => {
    const user = userEvent.setup();
    setup();

    await user.tab();
    await user.keyboard('{ArrowRight}{Enter}');
    expect(screen.getByRole('tab', { name: 'Billing' })).toHaveFocus();
    expect(screen.getByRole('tabpanel', { name: 'Profile' })).toBeVisible();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    expect(screen.getByRole('tabpanel', { name: 'Profile' })).toBeVisible();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel', { name: 'Settings' })).toBeVisible();
  });

  it('can activate on focus without wrapping at the end', async () => {
    const user = userEvent.setup();
    setup({
      defaultValue: 1,
      children: (
        <>
          <Tabs.List activateOnFocus aria-label="Steps" loopFocus={false}>
            <Tabs.Tab value={1}>First</Tabs.Tab>
            <Tabs.Tab value={2}>Second</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value={1}>Step one</Tabs.Panel>
          <Tabs.Panel value={2}>Step two</Tabs.Panel>
        </>
      ),
    });

    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus();
    expect(screen.getByRole('tabpanel', { name: 'Second' })).toBeVisible();
  });

  it('preserves input state in panels kept mounted while hiding inactive content', async () => {
    const user = userEvent.setup();
    setup({
      children: (
        <>
          <Tabs.List aria-label="Account">
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel keepMounted value="profile">
            <label>
              Name
              <input />
            </label>
          </Tabs.Panel>
          <Tabs.Panel value="settings">Your settings</Tabs.Panel>
        </>
      ),
    });

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ada');
    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(screen.queryByRole('textbox', { name: 'Name' })).toBeNull();
    await user.click(screen.getByRole('tab', { name: 'Profile' }));
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Ada');
  });
});
