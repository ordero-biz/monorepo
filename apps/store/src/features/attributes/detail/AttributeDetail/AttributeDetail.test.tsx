import { screen } from '@testing-library/react';
import { prepareStoreSetup } from '@/test/prepareSetup';
import { AttributeDetail } from './AttributeDetail';

vi.mock('./AttributeDetailHeader', () => ({
  AttributeDetailHeader: ({ attributeId }: { attributeId: string }) => (
    <div>Attribute header {attributeId}</div>
  ),
}));

vi.mock('./AttributeDetailValues', () => ({
  AttributeDetailValues: ({ attributeId }: { attributeId: string }) => (
    <div>Attribute values {attributeId}</div>
  ),
}));

const { setup } = prepareStoreSetup({
  component: AttributeDetail,
  props: {
    attributeId: '7',
  },
});

describe('AttributeDetail', () => {
  it('composes the attribute header and values sections', () => {
    setup();

    expect(screen.getByText('Attribute header 7')).toBeVisible();
    expect(screen.getByText('Attribute values 7')).toBeVisible();
  });
});
