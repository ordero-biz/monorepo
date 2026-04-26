import { render, screen } from '@testing-library/react';
import { Typography } from './Typography';

describe('Typography', () => {
  it('renders children content', () => {
    render(
      <Typography>
        <span>Nested text</span>
      </Typography>
    );

    expect(screen.getByText('Nested text')).toBeInTheDocument();
  });

  it('renders semantic tags for every variant', () => {
    render(
      <>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
      </>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Heading 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Heading 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'Heading 3' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 4, name: 'Heading 4' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 5, name: 'Heading 5' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 6, name: 'Heading 6' })
    ).toBeInTheDocument();
  });
});
