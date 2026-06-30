import { prepareSetup } from '@ordero/test-config/react';
import { screen } from '@testing-library/react';
import { Plus } from 'lucide-react';
import { Button } from '@/ui/components/Button';
import { Typography } from '@/ui/components/Typography';
import { PageHeader } from '.';
import type { PageHeaderProps } from './types';

describe('PageHeader', () => {
  const { setup } = prepareSetup<PageHeaderProps>({
    component: PageHeader.Root,
    props: {},
  });

  it('renders title content in the left slot', () => {
    setup({
      children: (
        <PageHeader.Left>
          <Typography variant="h5">Attributes list</Typography>
        </PageHeader.Left>
      ),
    });

    expect(
      screen.getByRole('heading', { name: 'Attributes list' })
    ).toBeInTheDocument();
  });

  it('supports compound composition with PageHeader.Left and PageHeader.Right', () => {
    setup({
      children: (
        <>
          <PageHeader.Left>
            <Typography variant="h5">Attributes list</Typography>
          </PageHeader.Left>
          <PageHeader.Right>
            <Button type="button">
              <Plus aria-hidden="true" />
              Create attribute
            </Button>
          </PageHeader.Right>
        </>
      ),
    });

    expect(
      screen.getByRole('heading', { name: 'Attributes list' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create attribute' })
    ).toBeInTheDocument();
  });
});
