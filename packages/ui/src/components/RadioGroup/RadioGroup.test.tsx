import { prepareSetup } from '@ordero/test-config/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from '@/ui/components/Radio';
import { RadioGroup } from './RadioGroup';
import type { RadioGroupProps } from './types';

const defaultChildren = (
  <>
    <Radio value="email">Email</Radio>
    <Radio value="sms">SMS</Radio>
    <Radio value="push">Push</Radio>
  </>
);

describe('RadioGroup', () => {
  const { setup } = prepareSetup<RadioGroupProps>({
    component: RadioGroup,
    props: {
      children: defaultChildren,
      label: 'Notification channel',
      onValueChange: vi.fn(),
    },
  });

  it('renders a radio group users can find by its label', () => {
    const { label } = setup({
      label: 'Delivery method',
    });

    expect(screen.getByRole('radiogroup', { name: label })).toBeInTheDocument();
  });

  it('describes the group with helper text', () => {
    const { helperText, label } = setup({
      helperText: 'Choose where order updates should be sent.',
      label: 'Updates',
    });

    expect(
      screen.getByRole('radiogroup', { name: label })
    ).toHaveAccessibleDescription(helperText);
  });

  it('updates the selected value when users choose a radio', async () => {
    const user = userEvent.setup();
    const { onValueChange } = setup({
      onValueChange: vi.fn(),
    });

    await user.click(screen.getByRole('radio', { name: 'Email' }));

    expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('email', expect.any(Object));
  });

  it('moves focus into the group when users click the group label', async () => {
    const user = userEvent.setup();

    setup({
      label: 'Delivery method',
    });

    const radioGroup = screen.getByRole('radiogroup', {
      name: 'Delivery method',
    });

    await user.click(screen.getByText('Delivery method'));

    expect(radioGroup).toContainElement(
      document.activeElement as HTMLElement | null
    );
  });

  it('disables all radios when the group is disabled', async () => {
    const user = userEvent.setup();

    setup({
      disabled: true,
    });

    const radio = screen.getByRole('radio', { name: 'Email' });

    await user.click(radio);

    expect(radio).toHaveAttribute('aria-disabled', 'true');
    expect(radio).not.toBeChecked();
  });

  it('resets uncontrolled selection back to defaultValue when the form resets', async () => {
    const user = userEvent.setup();

    render(
      <form>
        <RadioGroup defaultValue="email" label="Notification channel">
          {defaultChildren}
        </RadioGroup>
        <button type="reset">Reset form</button>
      </form>
    );

    const emailRadio = screen.getByRole('radio', { name: 'Email' });
    const smsRadio = screen.getByRole('radio', { name: 'SMS' });

    expect(emailRadio).toBeChecked();
    expect(smsRadio).not.toBeChecked();

    await user.click(smsRadio);

    expect(emailRadio).not.toBeChecked();
    expect(smsRadio).toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Reset form' }));

    await waitFor(() => {
      expect(screen.getByRole('radio', { name: 'Email' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'SMS' })).not.toBeChecked();
    });
  });
});
