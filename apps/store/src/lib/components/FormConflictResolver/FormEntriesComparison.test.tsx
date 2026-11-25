import type { DataTableColumnDef } from '@ordero/ui';
import { render, screen, within } from '@testing-library/react';
import {
  createFormEntriesRenderer,
  FormEntriesComparison,
  type FormEntryPreviewRow,
  type IdentifiableFormEntry,
} from './index';

type TestEntry = IdentifiableFormEntry & {
  name: string;
  quantity?: number;
};

const isBlankEntry = (entry: TestEntry) =>
  !entry.name.trim() && entry.quantity === undefined;

const normalizeEntry = (entry: TestEntry) => ({
  name: entry.name.trim(),
  quantity: entry.quantity ?? null,
});

const columns: DataTableColumnDef<FormEntryPreviewRow<TestEntry>>[] = [
  {
    id: 'name',
    header: () => <div>Item</div>,
    cell: ({ row: { original } }) => (
      <div>
        <span>{original.name || 'Empty'}</span>
        {original.source && <span>{original.source}</span>}
        {original.different && <span>Different</span>}
      </div>
    ),
  },
];

const rice: TestEntry = { clientId: 'existing-1', name: 'Rice', quantity: 2 };
const savedRice: TestEntry = {
  clientId: 'existing-2',
  name: 'Rice',
  quantity: 5,
};
const addedBeans: TestEntry = {
  clientId: 'new-1',
  name: 'Beans',
  quantity: 3,
};

describe('FormEntriesComparison', () => {
  it('renders update previews and choice tables through createFormEntriesRenderer', () => {
    const renderer = createFormEntriesRenderer({
      columns,
      isBlankEntry,
      normalizeEntry,
    });

    const { unmount } = render(
      <>
        {renderer.renderUpdate?.({
          baseline: [rice],
          current: [rice, addedBeans],
          latest: [savedRice],
          merged: [savedRice, addedBeans],
        })}
      </>
    );

    expect(screen.getByText('After applying · 2 rows')).toBeVisible();
    expect(
      screen.getByText(
        'The latest saved products will appear first. Your 1 row will be kept at the end.'
      )
    ).toBeVisible();
    const afterTable = within(
      screen.getByRole('table', { name: 'Products after applying' })
    );
    expect(afterTable.getByText('Saved version')).toBeVisible();
    expect(afterTable.getByText('Different')).toBeVisible();
    expect(afterTable.getByText('Your added row · kept')).toBeVisible();
    unmount();

    const localOption = renderer.renderChoice?.({
      value: [rice],
      otherValue: [savedRice, addedBeans],
      choice: 'local',
    });
    const serverOption = renderer.renderChoice?.({
      value: [savedRice, addedBeans],
      otherValue: [rice],
      choice: 'server',
    });

    expect(localOption?.label).toBe('Your product list (1 row)');
    expect(serverOption?.label).toBe('Saved product list (2 rows)');

    render(
      <>
        {localOption?.content}
        {serverOption?.content}
      </>
    );

    expect(
      screen.getByRole('table', { name: 'Your product list' })
    ).toBeVisible();
    expect(
      screen.getByRole('table', { name: 'Saved product list' })
    ).toBeVisible();
  });

  it('ignores blank initial placeholders in row counts', () => {
    const placeholder: TestEntry = {
      clientId: 'initial-placeholder',
      name: '',
    };

    render(
      <FormEntriesComparison
        baseline={[rice]}
        columns={columns}
        current={[rice]}
        isBlankEntry={isBlankEntry}
        latest={[placeholder]}
        merged={[placeholder]}
        normalizeEntry={normalizeEntry}
      />
    );

    expect(screen.getByText('After applying · 0 rows')).toBeVisible();
    expect(
      screen.getByText('This form will use the latest saved product list.')
    ).toBeVisible();
  });
});
