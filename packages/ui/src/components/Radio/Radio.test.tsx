import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from '@/ui/components/RadioGroup';
import { Radio } from './Radio';
import type { RadioProps } from './types';

type RadioTestCaseProps = RadioProps & {
  groupLabel?: string;
};

const RadioTestCase = ({
  groupLabel = 'Notification channel',
  ...props
}: RadioTestCaseProps) => (
  <RadioGroup label={groupLabel}>
    <Radio {...props} />
  </RadioGroup>
);

describe('Radio', () => {
  const { setup } = prepareSetup<RadioTestCaseProps>({
    component: RadioTestCase,
    props: {
      children: 'SMS',
      groupLabel: 'Notification channel',
      value: 'sms',
    },
  });

  it('renders a radio users can find by its label', () => {
    const { children } = setup({ children: 'SMS', value: 'sms' });

    expect(screen.getByRole('radio', { name: children })).toBeInTheDocument();
  });

  it('uses the aria-label as the accessible name when no visible label is rendered', () => {
    const { 'aria-label': ariaLabel } = setup({
      'aria-label': 'Phone call',
      children: undefined,
      value: 'phone',
    });

    expect(screen.getByRole('radio', { name: ariaLabel })).toBeInTheDocument();
  });

  it('selects when users click the radio', async () => {
    const user = userEvent.setup();

    const { children } = setup({
      children: 'Push notification',
      value: 'push',
    });

    await user.click(screen.getByRole('radio', { name: children }));

    expect(screen.getByRole('radio', { name: children })).toBeChecked();
  });

  it('selects when users click the visible label text', async () => {
    const user = userEvent.setup();

    const { children } = setup({
      children: 'Email updates',
      value: 'email-updates',
    });

    await user.click(screen.getByText(String(children)));

    expect(screen.getByRole('radio', { name: children })).toBeChecked();
  });

  it('fires onClick when users click the visible label text', async () => {
    const user = userEvent.setup();

    const { children, onClick } = setup({
      children: 'Weekly digest',
      onClick: vi.fn(),
      value: 'weekly-digest',
    });

    await user.click(screen.getByText(String(children)));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not select when disabled', async () => {
    const user = userEvent.setup();

    const { children } = setup({
      children: 'Disabled channel',
      disabled: true,
      value: 'disabled',
    });

    const radio = screen.getByRole('radio', { name: children });

    await user.click(radio);

    expect(radio).toHaveAttribute('aria-disabled', 'true');
    expect(radio).not.toBeChecked();
  });
});
