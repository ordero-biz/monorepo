import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { useRestoreFocus } from './useRestoreFocus';

type EditorProps = {
  isOpen: boolean;
};

const Editor = ({ isOpen }: EditorProps) => {
  const triggerRef = useRestoreFocus<HTMLButtonElement>(isOpen);
  return (
    <>
      <input aria-label="Other field" />
      {isOpen ? (
        <input aria-label="Product name" />
      ) : (
        <button ref={triggerRef} type="button">
          Edit details
        </button>
      )}
    </>
  );
};

const { setup } = prepareStoreSetup({
  component: Editor,
  props: { isOpen: false },
});

describe('useRestoreFocus', () => {
  it('does not focus the trigger on initial render', () => {
    setup();
    expect(
      screen.getByRole('button', { name: 'Edit details' })
    ).not.toHaveFocus();
  });

  it('restores focus to the remounted trigger when the editor closes', async () => {
    const user = userEvent.setup();
    const { renderResult } = setup();
    await user.click(screen.getByRole('button', { name: 'Edit details' }));
    renderResult.rerender({ isOpen: true });
    await user.click(screen.getByRole('textbox', { name: 'Product name' }));
    renderResult.rerender({ isOpen: false });
    expect(screen.getByRole('button', { name: 'Edit details' })).toHaveFocus();
  });

  it('restores focus after closing an initially open editor', () => {
    const { renderResult } = setup({ isOpen: true });
    renderResult.rerender({ isOpen: false });
    expect(screen.getByRole('button', { name: 'Edit details' })).toHaveFocus();
  });

  it('preserves user focus on opening and subsequent closed rerenders', async () => {
    const user = userEvent.setup();
    const { renderResult } = setup();
    const otherField = screen.getByRole('textbox', { name: 'Other field' });
    await user.click(otherField);
    renderResult.rerender({ isOpen: true });
    expect(otherField).toHaveFocus();

    renderResult.rerender({ isOpen: false });
    await user.click(otherField);
    renderResult.rerender({ isOpen: false });
    expect(otherField).toHaveFocus();
  });
});
