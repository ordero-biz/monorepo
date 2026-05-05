import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sparkles } from 'lucide-react';
import { Chip } from './Chip';
import type { ChipProps } from './types';

describe('Chip', () => {
  const { setup } = prepareSetup<ChipProps & { children: string }>({
    component: Chip,
    props: {
      children: 'Default',
    },
  });

  it('renders label content users can see', () => {
    const { children } = setup({ children: 'Processing' });

    expect(screen.getByText(children)).toBeInTheDocument();
  });

  it('renders a leading icon when startIcon is provided', () => {
    setup({
      children: 'With icon',
      startIcon: <Sparkles aria-hidden="true" />,
    });

    expect(screen.getByText('With icon')).toBeInTheDocument();
  });

  it('renders a remove action when onDelete is provided', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    setup({
      'aria-label': 'Tag',
      children: 'Tag',
      onDelete,
    });

    await user.click(screen.getByRole('button', { name: 'Remove Tag' }));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('does not call remove action when disabled', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    setup({
      'aria-label': 'Tag',
      children: 'Tag',
      disabled: true,
      onDelete,
    });

    await user.click(screen.getByRole('button', { name: 'Remove Tag' }));

    expect(onDelete).not.toHaveBeenCalled();
  });

});
