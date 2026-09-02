import { prepareSetup } from '@ordero/test-config/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { SplitButton } from './index';
import type { SplitButtonRootProps } from './types';

describe('SplitButton', () => {
  const { setup } = prepareSetup<SplitButtonRootProps>({
    component: SplitButton.Root,
    props: {
      'aria-label': 'Pull request actions',
      children: (
        <>
          <SplitButton.Action>Create pull request</SplitButton.Action>
          <SplitButton.Trigger aria-label="Choose pull request action" />
          <SplitButton.Content>
            <SplitButton.Item>Create draft pull request</SplitButton.Item>
          </SplitButton.Content>
        </>
      ),
    },
  });

  it('exposes a named group with separately named action and menu buttons', () => {
    const { 'aria-label': ariaLabel } = setup();

    expect(screen.getByRole('group', { name: ariaLabel })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create pull request' })
    ).not.toHaveAttribute('aria-haspopup');
    expect(
      screen.getByRole('button', { name: 'Choose pull request action' })
    ).toHaveAttribute('aria-haspopup', 'menu');
  });

  it('runs the main action independently from opening and choosing menu items', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onAlternative = vi.fn();

    setup({
      children: (
        <>
          <SplitButton.Action onClick={onAction}>
            Create pull request
          </SplitButton.Action>
          <SplitButton.Trigger aria-label="Choose pull request action" />
          <SplitButton.Content>
            <SplitButton.Item onClick={onAlternative}>
              Create draft pull request
            </SplitButton.Item>
          </SplitButton.Content>
        </>
      ),
    });

    await user.click(
      screen.getByRole('button', { name: 'Create pull request' })
    );
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Choose pull request action' })
    );
    expect(onAction).toHaveBeenCalledTimes(1);
    await user.click(
      await screen.findByRole('menuitem', { name: 'Create draft pull request' })
    );
    expect(onAlternative).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('disables both buttons when the root is disabled', async () => {
    const user = userEvent.setup();
    setup({ disabled: true });

    expect(
      screen.getByRole('button', { name: 'Create pull request' })
    ).toBeDisabled();
    const trigger = screen.getByRole('button', {
      name: 'Choose pull request action',
    });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('keeps alternative actions available when only the main action is disabled', async () => {
    const user = userEvent.setup();
    setup({
      children: (
        <>
          <SplitButton.Action disabled>Create pull request</SplitButton.Action>
          <SplitButton.Trigger aria-label="Choose pull request action" />
          <SplitButton.Content>
            <SplitButton.Item>Create draft pull request</SplitButton.Item>
          </SplitButton.Content>
        </>
      ),
    });

    expect(
      screen.getByRole('button', { name: 'Create pull request' })
    ).toBeDisabled();
    await user.click(
      screen.getByRole('button', { name: 'Choose pull request action' })
    );
    expect(
      await screen.findByRole('menuitem', { name: 'Create draft pull request' })
    ).toBeVisible();
  });

  it('supports keyboard access to both halves and restores focus after Escape', async () => {
    const user = userEvent.setup();
    setup();

    await user.tab();
    expect(
      screen.getByRole('button', { name: 'Create pull request' })
    ).toHaveFocus();
    await user.tab();
    const trigger = screen.getByRole('button', {
      name: 'Choose pull request action',
    });
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(
      await screen.findByRole('menuitem', { name: 'Create draft pull request' })
    ).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('supports consumer-controlled menu visibility', async () => {
    const user = userEvent.setup();
    const { onOpenChange, renderResult } = setup({
      open: false,
      onOpenChange: vi.fn(),
    });

    await user.click(
      screen.getByRole('button', { name: 'Choose pull request action' })
    );
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(true));
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    renderResult.rerender({ open: true });
    expect(
      await screen.findByRole('menuitem', { name: 'Create draft pull request' })
    ).toBeVisible();
  });

  it('allows choosing the next main action without executing it', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const SelectedActionExample = () => {
      const [action, setAction] = useState('Create pull request');

      return (
        <SplitButton.Root aria-label="Pull request actions">
          <SplitButton.Action onClick={() => onAction(action)}>
            {action}
          </SplitButton.Action>
          <SplitButton.Trigger aria-label="Choose pull request action" />
          <SplitButton.Content>
            <SplitButton.Item
              onClick={() => setAction('Create draft pull request')}
            >
              Create draft pull request
            </SplitButton.Item>
          </SplitButton.Content>
        </SplitButton.Root>
      );
    };
    const { setup: setupSelectedAction } = prepareSetup({
      component: SelectedActionExample,
      props: {},
    });
    setupSelectedAction();

    await user.click(
      screen.getByRole('button', { name: 'Choose pull request action' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Create draft pull request' })
    );
    expect(onAction).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('button', { name: 'Create draft pull request' })
    );
    expect(onAction).toHaveBeenCalledWith('Create draft pull request');
  });

  it('submits only from the main action when it is a submit button', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        <SplitButton.Root aria-label="Pull request actions">
          <SplitButton.Action type="submit">
            Create pull request
          </SplitButton.Action>
          <SplitButton.Trigger aria-label="Choose pull request action" />
          <SplitButton.Content>
            <SplitButton.Item>Create draft pull request</SplitButton.Item>
          </SplitButton.Content>
        </SplitButton.Root>
      </form>
    );

    await user.click(
      screen.getByRole('button', { name: 'Choose pull request action' })
    );
    await user.click(
      await screen.findByRole('menuitem', { name: 'Create draft pull request' })
    );
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('button', { name: 'Create pull request' })
    );
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });
});
