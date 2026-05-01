import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from '@/ui/components/RadioGroup';
import { Radio } from './Radio';
import type { RadioProps } from './types';

const renderRadio = ({
  groupLabel = 'Notification channel',
  ...props
}: RadioProps & { groupLabel?: string }) =>
  render(
    <RadioGroup label={groupLabel}>
      <Radio {...props} />
    </RadioGroup>
  );

describe('Radio', () => {
  it('renders a radio users can find by its label', () => {
    renderRadio({ children: 'SMS', value: 'sms' });

    expect(screen.getByRole('radio', { name: 'SMS' })).toBeInTheDocument();
  });

  it('uses the aria-label as the accessible name when no visible label is rendered', () => {
    renderRadio({
      'aria-label': 'Phone call',
      value: 'phone',
    });

    expect(
      screen.getByRole('radio', { name: 'Phone call' })
    ).toBeInTheDocument();
  });

  it('selects when users click the radio', async () => {
    const user = userEvent.setup();
    renderRadio({
      children: 'Push notification',
      value: 'push',
    });

    await user.click(screen.getByRole('radio', { name: 'Push notification' }));

    expect(
      screen.getByRole('radio', { name: 'Push notification' })
    ).toBeChecked();
  });

  it('selects when users click the visible label text', async () => {
    const user = userEvent.setup();
    renderRadio({
      children: 'Email updates',
      value: 'email-updates',
    });

    await user.click(screen.getByText('Email updates'));

    expect(screen.getByRole('radio', { name: 'Email updates' })).toBeChecked();
  });

  it('fires onClick when users click the visible label text', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    renderRadio({
      children: 'Weekly digest',
      onClick,
      value: 'weekly-digest',
    });

    await user.click(screen.getByText('Weekly digest'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not select when disabled', async () => {
    const user = userEvent.setup();
    renderRadio({
      children: 'Disabled channel',
      disabled: true,
      value: 'disabled',
    });

    const radio = screen.getByRole('radio', { name: 'Disabled channel' });

    await user.click(radio);

    expect(radio).toHaveAttribute('aria-disabled', 'true');
    expect(radio).not.toBeChecked();
  });
});
