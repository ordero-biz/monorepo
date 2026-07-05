import { prepareSetup } from '@ordero/test-config/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Textarea } from './Textarea';
import type { TextareaProps } from './types';

describe('Textarea', () => {
  const { setup } = prepareSetup<TextareaProps>({
    component: Textarea,
    props: {
      'aria-label': 'Standalone textarea',
      onValueChange: vi.fn(),
      placeholder: 'Type here',
    },
  });

  it('renders a standalone textbox', () => {
    const { 'aria-label': ariaLabel } = setup({
      'aria-label': 'Description',
    });

    expect(
      screen.getByRole('textbox', { name: ariaLabel })
    ).toBeInTheDocument();
  });

  it('renders the initial value and supports readonly and required states', () => {
    const { 'aria-label': ariaLabel, defaultValue } = setup({
      'aria-label': 'Notes',
      defaultValue: 'Initial note',
      readOnly: true,
      required: true,
    });

    const textarea = screen.getByRole('textbox', { name: ariaLabel });

    expect(textarea).toHaveValue(defaultValue);
    expect(textarea).toHaveAttribute('readonly');
    expect(textarea).toBeRequired();
  });

  it('calls onValueChange when the user types', async () => {
    const user = userEvent.setup();

    const { 'aria-label': ariaLabel, onValueChange } = setup({
      'aria-label': 'Comment',
      onValueChange: vi.fn(),
    });

    await user.type(screen.getByRole('textbox', { name: ariaLabel }), 'Ada');

    expect(onValueChange).toHaveBeenLastCalledWith('Ada', {
      event: expect.any(Object),
    });
  });

  it('disables the textbox when disabled is set', () => {
    const { 'aria-label': ariaLabel } = setup({
      'aria-label': 'Disabled notes',
      disabled: true,
      variant: 'filled',
    });

    expect(screen.getByRole('textbox', { name: ariaLabel })).toBeDisabled();
  });

  it('exposes invalid state to assistive technology', () => {
    const { 'aria-label': ariaLabel } = setup({
      'aria-label': 'Invalid notes',
      invalid: true,
    });

    expect(screen.getByRole('textbox', { name: ariaLabel })).toBeInvalid();
  });

  it('calls focus, blur, and keydown handlers for user interactions', async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onBlur = vi.fn();
    const onKeyDown = vi.fn();

    render(
      <>
        <Textarea
          aria-label="Comment"
          onBlur={onBlur}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
        <button type="button">Next focus target</button>
      </>
    );

    await user.tab();
    await user.keyboard('{Enter}');
    await user.tab();

    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onKeyDown).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('button', { name: 'Next focus target' })
    ).toHaveFocus();
  });
});
