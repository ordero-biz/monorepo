import type { Page } from '@playwright/test';
import {
  draftSupply,
  expect,
  returnToEditor,
  supplyApiPath,
  supplyPath,
  test,
} from './fixtures/supply';

test.use({
  viewport: { width: 1440, height: 1000 },
  video: { mode: 'on', size: { width: 1440, height: 1000 } },
  trace: 'on',
  launchOptions: { slowMo: Number(process.env.PLAYWRIGHT_SLOW_MO ?? 0) },
});

const openEditor = async (page: Page) => {
  await page.goto(supplyPath);
  await expect(page.getByRole('form', { name: 'Supply' })).toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Supply number', exact: true })
  ).toHaveValue('SUP-009');
  // SSR exposes the form before hydration finishes. Opening a real control
  // verifies client readiness without changing values or making the form dirty.
  await page.getByRole('combobox', { name: 'Supplier', exact: true }).click();
  await expect(
    page.getByRole('option', { name: 'Fresh Farms', exact: true })
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
};
const reviewUpdates = async (page: Page) => {
  const notice = page.getByRole('dialog', {
    name: 'Supply changed',
    exact: true,
  });
  await expect(notice).toBeVisible();
  await notice.getByRole('button', { name: 'Review updates' }).click();
  await expect(
    page.getByRole('dialog', { name: 'Review updates', exact: true })
  ).toBeVisible();
  await expect(notice).toHaveCount(0);
};
const waitForPatch = (page: Page) =>
  page.waitForRequest(
    (request) =>
      new URL(request.url()).pathname === supplyApiPath &&
      request.method() === 'PATCH'
  );

// Use the real application, server prefetch, BFF and focus refetch. The backend
// fixture supplies deterministic records and a separate session for each test.
test.describe('Supply refresh and conflict resolution', () => {
  test('an already finalized supply opens directly in the read-only page', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await savedSupply.replace({
      status: 'COMPLETED',
      comment: 'Finalized before opening',
    });
    await page.goto(supplyPath);

    await expect(page.getByText('Completed', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Finalized before opening', { exact: true })
    ).toBeVisible();
    await expect(page.getByRole('form', { name: 'Supply' })).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Save draft' })).toHaveCount(
      0
    );
    await capture('Already finalized — full read-only page');
  });

  test('a pristine editor becomes a read-only page when another session finalizes it', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await capture('Before finalization — pristine draft');
    await savedSupply.replace({
      status: 'COMPLETED',
      comment: 'Finalized in another session',
    });
    await returnToEditor(page);

    await expect(page.getByText('Completed', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Finalized in another session', { exact: true })
    ).toBeVisible();
    await expect(page.getByRole('form', { name: 'Supply' })).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await capture('After refetch — full read-only page');
  });

  test('a dirty editor announces external finalization and preserves edits with saving blocked', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await test.step('Keep unsaved text and an unfinished added row', async () => {
      await page
        .getByRole('textbox', { name: 'Comment', exact: true })
        .fill('My unsaved comment');
      await page
        .getByRole('textbox', { name: 'Supplier invoice number' })
        .fill('MY-UNSAVED-INVOICE');
      await page.getByRole('button', { name: '+ Add another product' }).click();
      await page
        .getByRole('textbox', { name: 'Comment for row 2' })
        .fill('Unfinished new product');
    });
    await savedSupply.replace({
      status: 'COMPLETED',
      comment: 'Final saved comment',
    });
    await returnToEditor(page);
    const notice = page.getByRole('dialog', {
      name: 'Supply finalized',
      exact: true,
    });
    await expect(notice).toHaveAccessibleDescription(
      'This supply was finalized elsewhere. Your unsaved edits remain on this page, but can no longer be saved.'
    );
    await expect(notice.getByRole('button')).toHaveCount(1);
    await capture('Unsaved edits — finalization notice');
    await notice.getByRole('button', { name: 'Close', exact: true }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My unsaved comment');
    await expect(
      page.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('MY-UNSAVED-INVOICE');
    await expect(
      page.getByRole('textbox', { name: 'Comment for row 2' })
    ).toHaveValue('Unfinished new product');
    await expect(
      page.getByRole('button', { name: 'Save draft' })
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Finalize supply', exact: true })
    ).toBeDisabled();
    await capture('Back to the preserved draft — save actions disabled');
    await page.getByRole('button', { name: 'Review updates' }).click();
    await expect(notice).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('external finalization replaces open conflict choices with the finalization notice', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My unsaved comment');
    await savedSupply.replace({ comment: 'Saved elsewhere' });
    await returnToEditor(page);
    await reviewUpdates(page);
    const conflicts = page.getByRole('dialog', {
      name: 'Review updates',
    });
    await conflicts
      .getByRole('radio', { name: 'Keep my changes: My unsaved comment' })
      .check();

    await savedSupply.replace({ status: 'COMPLETED' });
    await returnToEditor(page);
    const notice = page.getByRole('dialog', {
      name: 'Supply finalized',
      exact: true,
    });
    await expect(notice).toBeVisible();
    await expect(conflicts).toHaveCount(0);
    await capture('Finalization supersedes open conflict choices');
    await notice.getByRole('button', { name: 'Close', exact: true }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My unsaved comment');
    await expect(
      page.getByRole('button', { name: 'Save draft' })
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Finalize supply', exact: true })
    ).toBeDisabled();
  });

  test('finalizing your own draft replaces the editor with the read-only page', async ({
    page,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('button', { name: 'Finalize supply', exact: true })
      .click();
    const confirmation = page.getByRole('dialog', {
      name: 'Finalize supply',
      exact: true,
    });
    await capture('Confirm finalization');
    const request = waitForPatch(page);
    await confirmation
      .getByRole('button', { name: 'Finalize supply', exact: true })
      .click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 1,
      status: 'COMPLETED',
    });
    await expect(page.getByRole('form', { name: 'Supply' })).toHaveCount(0);
    await expect(page.getByText('Completed', { exact: true })).toBeVisible();
    await capture('Your finalized supply — full read-only page');
  });

  test('a pristine editor adopts new saved values and saves against their version', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await savedSupply.replace({
      supplyNumber: 'SUP-UPDATED',
      comment: 'Changed elsewhere',
    });
    await returnToEditor(page);
    await expect(
      page.getByRole('textbox', { name: 'Supply number', exact: true })
    ).toHaveValue('SUP-UPDATED');
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('Changed elsewhere');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: 'Review updates' })
    ).toHaveCount(0);
    await capture('Pristine editor automatically refreshed');
    await page
      .getByRole('textbox', { name: 'Supplier invoice number' })
      .fill('INV-AFTER-REFRESH');
    const request = waitForPatch(page);
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 2,
      supplierInvoiceNumber: 'INV-AFTER-REFRESH',
    });
    await expect(
      page.getByText('Supply draft saved.', { exact: true })
    ).toBeVisible();
  });

  test('independent edits survive repeated refreshes and save with the latest accepted version', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Supplier invoice number' })
      .fill('MY-UNSAVED-INVOICE');
    await savedSupply.replace({ supplyNumber: 'SUP-SECOND' });
    await returnToEditor(page);
    await capture('Saved changes notice');
    await reviewUpdates(page);
    const review = page.getByRole('dialog', { name: 'Review updates' });
    const summary = review.getByRole('region', { name: 'Updates to apply' });
    await expect(review).toHaveAccessibleDescription(
      'Review the saved updates below. Your unsaved edits will be kept.'
    );
    await expect(
      review.getByRole('button', { name: 'Apply changes' })
    ).toHaveAccessibleDescription(
      'This action does not save or finalize this supply.'
    );
    await expect(summary.getByText('SUP-009', { exact: true })).toBeVisible();
    await expect(
      summary.getByText('SUP-SECOND', { exact: true })
    ).toBeVisible();
    await expect(review.getByRole('radiogroup')).toHaveCount(0);
    await expect(page.getByLabel(/^Supply number/)).toHaveValue('SUP-009');
    await capture('Automatic updates are previewed before application');
    await review.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Supply number', exact: true })
    ).toHaveValue('SUP-009');
    await page.getByRole('button', { name: 'Review updates' }).click();
    await expect(review).toBeVisible();
    await expect(
      page.getByRole('dialog', { name: 'Supply changed', exact: true })
    ).toHaveCount(0);
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Supply number', exact: true })
    ).toHaveValue('SUP-SECOND');
    await expect(
      page.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('MY-UNSAVED-INVOICE');
    await savedSupply.replace({ supplyNumber: 'SUP-THIRD' });
    await returnToEditor(page);
    await reviewUpdates(page);
    await expect(page.getByLabel(/^Supply number/)).toHaveValue('SUP-SECOND');
    await expect(summary.getByText('SUP-THIRD', { exact: true })).toBeVisible();
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Supply number', exact: true })
    ).toHaveValue('SUP-THIRD');
    await expect(
      page.getByRole('textbox', { name: 'Supplier invoice number' })
    ).toHaveValue('MY-UNSAVED-INVOICE');
    await capture('Two refreshes — local invoice is still preserved');
    const request = waitForPatch(page);
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 3,
      supplierInvoiceNumber: 'MY-UNSAVED-INVOICE',
    });
    await expect(
      page.getByText('Supply draft saved.', { exact: true })
    ).toBeVisible();
  });

  test('a newer saved version with no field updates keeps edits and requires explicit acceptance', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My unsaved note');
    await savedSupply.replace({});
    await returnToEditor(page);
    await page
      .getByRole('dialog', { name: 'Supply changed', exact: true })
      .getByRole('button', { name: 'Review updates' })
      .click();
    const review = page.getByRole('dialog', { name: 'No updates to review' });
    await expect(review).toHaveAccessibleDescription(
      'There are no field updates to review. You can use the latest saved version while keeping your edits.'
    );
    await expect(review.getByRole('radiogroup')).toHaveCount(0);
    await expect(
      review.getByRole('button', { name: 'Apply changes' })
    ).toHaveCount(0);
    const accept = review.getByRole('button', { name: 'Use latest version' });
    await expect(accept).toHaveAccessibleDescription(
      'This action does not save or finalize this supply.'
    );
    await capture(
      'No field updates — use the latest version without losing edits'
    );
    await review.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My unsaved note');
    await page.getByRole('button', { name: 'Review updates' }).click();
    await expect(review).toBeVisible();
    await accept.click();
    await expect(review).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: 'Review updates' })
    ).toHaveCount(0);
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My unsaved note');
    const request = waitForPatch(page);
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 2,
      comment: 'My unsaved note',
    });
    await expect(
      page.getByText('Supply draft saved.', { exact: true })
    ).toBeVisible();
  });

  test('a newer version updates an open automatic review and can introduce conflicts', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Supplier invoice number' })
      .fill('MY-INVOICE');
    await savedSupply.replace({ supplyNumber: 'SUP-SECOND' });
    await returnToEditor(page);
    await reviewUpdates(page);
    const review = page.getByRole('dialog', { name: 'Review updates' });
    await expect(review).toHaveAccessibleDescription(
      'Review the saved updates below. Your unsaved edits will be kept.'
    );
    await expect(review.getByRole('radiogroup')).toHaveCount(0);

    await savedSupply.replace({
      supplyNumber: 'SUP-THIRD',
      supplierInvoiceNumber: 'SAVED-INVOICE',
    });
    await returnToEditor(page);
    await expect(review).toHaveAccessibleDescription(
      'Review the saved updates below, then choose which values to keep where both versions changed.'
    );
    await expect(
      page.getByRole('dialog', { name: 'Supply changed', exact: true })
    ).toHaveCount(0);
    await expect(
      review
        .getByRole('region', { name: 'Updates to apply' })
        .getByText('SUP-THIRD', { exact: true })
    ).toBeVisible();
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      review.getByRole('radiogroup', { name: 'Supplier invoice number' })
    ).toHaveAccessibleDescription('Choose which value to keep.');
    await expect(page.getByLabel(/^Supply number/)).toHaveValue('SUP-009');
    await capture('New version adds a conflict alongside automatic updates');
    await review
      .getByRole('radio', { name: 'Keep my changes: MY-INVOICE' })
      .check();
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Supply number', exact: true })
    ).toHaveValue('SUP-THIRD');
    const request = waitForPatch(page);
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 3,
      supplierInvoiceNumber: 'MY-INVOICE',
    });
    await expect(
      page.getByText('Supply draft saved.', { exact: true })
    ).toBeVisible();
  });

  for (const choice of ['Keep my changes', 'Use saved value'] as const) {
    test(`conflicting text supports "${choice}" while retaining unrelated edits`, async ({
      page,
      savedSupply,
      capture,
    }) => {
      await openEditor(page);
      await page
        .getByRole('textbox', { name: 'Comment', exact: true })
        .fill('My conflicting comment');
      await page
        .getByRole('textbox', { name: 'Supply number', exact: true })
        .fill('MY-NUMBER');
      await page
        .getByRole('textbox', { name: 'Supplier invoice number' })
        .fill('MY-UNSAVED-INVOICE');
      await savedSupply.replace({
        comment: 'Saved conflicting comment',
        supplyNumber: 'SAVED-NUMBER',
      });
      await returnToEditor(page);
      await reviewUpdates(page);
      const conflict = page.getByRole('dialog', {
        name: 'Review updates',
      });
      const apply = conflict.getByRole('button', { name: 'Apply changes' });
      await expect(conflict).toHaveAccessibleDescription(
        'Some details changed both on your page and in the saved version. Choose which values to keep. Your other edits will be kept.'
      );
      const numberChoices = conflict.getByRole('radiogroup', {
        name: 'Supply number',
      });
      const commentChoices = conflict.getByRole('radiogroup', {
        name: 'Comment',
      });
      const requiredMessage = 'Choose which value to keep.';
      await apply.click();
      await expect(numberChoices).toHaveAccessibleDescription(requiredMessage);
      await expect(commentChoices).toHaveAccessibleDescription(requiredMessage);
      await expect(conflict).toBeVisible();
      await capture('Competing comments require an explicit choice');
      const expectedComment =
        choice === 'Keep my changes'
          ? 'My conflicting comment'
          : 'Saved conflicting comment';
      await conflict
        .getByRole('radio', { name: `${choice}: ${expectedComment}` })
        .check();
      await expect(commentChoices).not.toHaveAccessibleDescription(
        requiredMessage
      );
      await apply.click();
      await expect(conflict).toBeVisible();
      await expect(numberChoices).toHaveAccessibleDescription(requiredMessage);
      await capture('A choice is required for every conflicting field');
      await numberChoices
        .getByRole('radio', { name: 'Use saved value: SAVED-NUMBER' })
        .check();
      await expect(
        conflict.getByText(requiredMessage, { exact: true })
      ).toHaveCount(0);
      await apply.focus();
      await page.keyboard.press('Enter');
      await expect(
        page.getByRole('textbox', { name: 'Supply number', exact: true })
      ).toHaveValue('SAVED-NUMBER');
      await expect(
        page.getByRole('textbox', { name: 'Comment', exact: true })
      ).toHaveValue(expectedComment);
      await expect(
        page.getByRole('textbox', { name: 'Supplier invoice number' })
      ).toHaveValue('MY-UNSAVED-INVOICE');
      await capture(`${choice} applied — unrelated invoice preserved`);
      const request = waitForPatch(page);
      await page.getByRole('button', { name: 'Save draft' }).click();
      expect((await request).postDataJSON()).toEqual({
        expectedVersion: 2,
        supplierInvoiceNumber: 'MY-UNSAVED-INVOICE',
        ...(choice === 'Keep my changes'
          ? { comment: 'My conflicting comment' }
          : {}),
      });
      await expect(
        page.getByText('Supply draft saved.', { exact: true })
      ).toBeVisible();
    });
  }

  test('dismissing and cancelling a review preserves edits and the footer can reopen it', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My ongoing edit');
    await savedSupply.replace({ comment: 'Saved competing edit' });
    await returnToEditor(page);
    await page
      .getByRole('dialog', { name: 'Supply changed', exact: true })
      .getByRole('button', { name: 'Keep editing' })
      .click();
    const actions = page.getByRole('complementary', {
      name: 'Supply creation actions',
    });
    await expect(
      actions.getByRole('button', { name: 'Review updates' })
    ).toBeVisible();
    await expect(
      actions.getByRole('button', { name: 'Save draft' })
    ).toBeEnabled();
    await capture('Review action next to draft and finalize');
    await returnToEditor(page);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await actions.getByRole('button', { name: 'Review updates' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Supply changed', exact: true })
    ).toHaveCount(0);
    const conflict = page.getByRole('dialog', {
      name: 'Review updates',
    });
    await conflict
      .getByRole('radio', { name: 'Use saved value: Saved competing edit' })
      .check();
    await conflict.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My ongoing edit');
    await capture('Cancelled review — original local edit retained');
    await savedSupply.replace({ comment: 'Another newer edit' });
    await returnToEditor(page);
    await expect(
      page.getByRole('dialog', { name: 'Supply changed', exact: true })
    ).toBeVisible();
  });

  test('a newer saved revision clears choices made in an open conflict dialog', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My conflicting comment');
    await savedSupply.replace({ comment: 'Saved version two' });
    await returnToEditor(page);
    await reviewUpdates(page);
    const conflict = page.getByRole('dialog', {
      name: 'Review updates',
    });
    await conflict
      .getByRole('radio', { name: 'Keep my changes: My conflicting comment' })
      .check();
    await expect(
      conflict.getByRole('button', { name: 'Apply changes' })
    ).toBeEnabled();
    await capture('Choice made against version two');
    await savedSupply.replace({ comment: 'Saved version three' });
    await returnToEditor(page);
    await expect(
      conflict.getByRole('radio', {
        name: 'Use saved value: Saved version three',
      })
    ).toBeVisible();
    await expect(
      conflict.getByRole('radio', {
        name: 'Keep my changes: My conflicting comment',
      })
    ).not.toBeChecked();
    await conflict.getByRole('button', { name: 'Apply changes' }).click();
    await expect(conflict).toBeVisible();
    await expect(
      conflict.getByRole('radiogroup', { name: 'Comment' })
    ).toHaveAccessibleDescription('Choose which value to keep.');
    await capture('New version — choices must be reviewed again');
    await conflict
      .getByRole('radio', { name: 'Keep my changes: My conflicting comment' })
      .check();
    await conflict.getByRole('button', { name: 'Apply changes' }).click();
    const request = waitForPatch(page);
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 3,
      comment: 'My conflicting comment',
    });
    await expect(
      page.getByText('Supply draft saved.', { exact: true })
    ).toBeVisible();
  });

  test('new local rows are appended after refreshed saved rows, including unfinished rows', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page.getByRole('button', { name: '+ Add another product' }).click();
    await page.getByRole('combobox', { name: 'Product for row 2' }).click();
    await page
      .getByRole('option', { name: 'Lentils · LENTILS', exact: true })
      .click();
    await page
      .getByRole('textbox', { name: 'Comment for row 2' })
      .fill('My unfinished new row');
    await capture('Locally added Lentils row');
    await savedSupply.replace({
      supplyEntries: [
        draftSupply.supplyEntries[0],
        {
          ...draftSupply.supplyEntries[0],
          id: 18,
          productVariant: {
            barcode: '',
            id: 12,
            name: 'Oats',
            sku: 'OATS',
          },
          quantity: 3,
        },
      ],

      totalPrice: 25,
    });
    await returnToEditor(page);
    await reviewUpdates(page);
    const review = page.getByRole('dialog', { name: 'Review updates' });
    await expect(
      page.getByLabel('Product for row 2', { exact: true })
    ).toHaveValue('Lentils · LENTILS');
    await expect(
      page.getByLabel('Product for row 3', { exact: true })
    ).toHaveCount(0);
    await expect(
      review.getByRole('table', { name: 'Products after applying' })
    ).toBeVisible();
    const products = review.getByRole('table', {
      name: 'Products after applying',
    });
    await expect(
      review.getByText('Supply products', { exact: true })
    ).toBeVisible();
    await expect(review.getByText('After applying · 3 rows')).toBeVisible();
    await expect(
      review.getByRole('heading', { name: 'Updates to apply' })
    ).toHaveCount(0);
    const rows = products.getByRole('row');
    await expect(rows).toHaveCount(4);
    await expect(rows.nth(1)).toContainText('Rice');
    await expect(
      rows.nth(1).getByText('Different', { exact: true })
    ).toHaveCount(0);
    await expect(rows.nth(2)).toContainText('Oats');
    await expect(rows.nth(2)).toContainText('Saved version');
    await expect(
      rows.nth(2).getByText('Different', { exact: true })
    ).toBeVisible();
    await expect(rows.nth(3)).toContainText('Lentils');
    await expect(rows.nth(3)).toContainText('Your added row · kept');
    await expect(
      rows.nth(3).getByText('Different', { exact: true })
    ).toHaveCount(0);
    await expect(
      rows.nth(3).getByRole('cell', { name: 'Not entered', exact: true })
    ).toHaveCount(1);
    await products.getByText('Comment', { exact: true }).click();
    await expect(products.getByText('My unfinished new row')).toBeVisible();
    await expect(
      review.getByText(
        'The latest saved products will appear first. Your 1 row will be kept at the end.'
      )
    ).toBeVisible();
    await capture('Saved and unsaved product rows previewed together');
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      page.getByRole('combobox', { name: 'Product for row 1' })
    ).toHaveValue('Rice · RICE');
    await expect(
      page.getByRole('combobox', { name: 'Product for row 2' })
    ).toHaveValue('Oats · OATS');
    await expect(
      page.getByRole('combobox', { name: 'Product for row 3' })
    ).toHaveValue('Lentils · LENTILS');
    await expect(
      page.getByRole('textbox', { name: 'Comment for row 3' })
    ).toHaveValue('My unfinished new row');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await capture('Saved Rice and Oats first — unsaved Lentils appended');
  });

  for (const choice of ['local', 'server'] as const) {
    test(`competing product lists preserve the ${choice} list on ${choice === 'local' ? 'desktop' : 'mobile'}`, async ({
      page,
      savedSupply,
      capture,
    }) => {
      if (choice === 'server') {
        await page.setViewportSize({ width: 390, height: 844 });
      }
      const saved = await savedSupply.replace({
        supplyEntries: [
          draftSupply.supplyEntries[0],
          {
            ...draftSupply.supplyEntries[0],
            id: 18,
            productVariant: {
              barcode: '',
              id: 12,
              name: 'Oats',
              sku: 'OATS',
            },
          },
          {
            ...draftSupply.supplyEntries[0],
            id: 19,
            productVariant: {
              barcode: '',
              id: 13,
              name: 'Lentils',
              sku: 'LENTILS',
            },
          },
        ],

        totalPrice: 30,
      });
      await openEditor(page);
      await page
        .getByRole('spinbutton', { name: 'Quantity for row 1', exact: true })
        .fill('7');
      await savedSupply.replace({
        supplyEntries: saved.supplyEntries
          .slice(0, 2)
          .map((entry, index) =>
            index === 0 ? { ...entry, quantity: 4 } : entry
          ),

        totalPrice: 40,
      });
      await returnToEditor(page);
      await reviewUpdates(page);
      const conflict = page.getByRole('dialog', {
        name: 'Review updates',
      });
      await expect(
        conflict.getByRole('radio', { name: 'Your product list (3 rows)' })
      ).toBeVisible();
      await expect(
        conflict.getByRole('radio', { name: 'Saved product list (2 rows)' })
      ).toBeVisible();
      const localTable = conflict.getByRole('table', {
        name: 'Your product list',
        exact: true,
      });
      const savedTable = conflict.getByRole('table', {
        name: 'Saved product list',
        exact: true,
      });
      await expect(localTable.getByRole('row')).toHaveCount(4);
      await expect(savedTable.getByRole('row')).toHaveCount(3);
      await expect(
        localTable.getByRole('cell', { name: '7 Bag (bag)', exact: true })
      ).toBeVisible();
      await expect(
        savedTable.getByRole('cell', { name: '4 Bag (bag)', exact: true })
      ).toBeVisible();
      await expect(savedTable.getByText('Lentils')).toHaveCount(0);
      await expect(
        localTable.getByText('Different', { exact: true })
      ).toHaveCount(2);
      await expect(
        savedTable.getByText('Different', { exact: true })
      ).toHaveCount(1);
      await expect(
        localTable
          .getByRole('row')
          .filter({ hasText: 'Oats' })
          .getByText('Different', { exact: true })
      ).toHaveCount(0);
      const localBounds = await localTable.boundingBox();
      const savedBounds = await savedTable.boundingBox();
      const dialogBounds = await conflict.boundingBox();
      if (!localBounds || !savedBounds || !dialogBounds) {
        throw new Error('Product comparison tables must be visible.');
      }
      // Every column must fit without clipping prices in either layout.
      expect(savedBounds.x + savedBounds.width).toBeLessThanOrEqual(
        dialogBounds.x + dialogBounds.width - 24
      );
      if (choice === 'local') {
        expect(localBounds.x + localBounds.width).toBeLessThanOrEqual(
          savedBounds.x
        );
        expect(localBounds.y).toBe(savedBounds.y);
      } else {
        expect(localBounds.x + localBounds.width).toBeLessThanOrEqual(
          dialogBounds.x + dialogBounds.width - 24
        );
        expect(savedBounds.y).toBeGreaterThan(
          localBounds.y + localBounds.height
        );
      }
      await test.info().attach('Product lists before selection', {
        body: await conflict.screenshot(),
        contentType: 'image/png',
      });
      await conflict.getByRole('button', { name: 'Apply changes' }).click();
      await expect(
        conflict.getByText('Choose which value to keep.')
      ).toBeVisible();
      await capture('Existing row was edited in both sessions');
      if (choice === 'server') {
        const savedPrice = savedTable
          .getByRole('cell', { name: '$5.00', exact: true })
          .last();
        await savedPrice.scrollIntoViewIfNeeded();
        await expect(savedPrice).toBeInViewport();
        await expect(
          conflict.getByRole('button', { name: 'Apply changes' })
        ).toBeInViewport();
      }
      await conflict
        .getByRole('radio', {
          name:
            choice === 'local'
              ? 'Your product list (3 rows)'
              : 'Saved product list (2 rows)',
        })
        .check();
      await test.info().attach('Selected product list', {
        body: await conflict.screenshot(),
        contentType: 'image/png',
      });
      await conflict.getByRole('button', { name: 'Apply changes' }).click();
      await expect(
        page.getByRole('spinbutton', {
          name: 'Quantity for row 1',
          exact: true,
        })
      ).toHaveValue(choice === 'local' ? '7' : '4');
      if (choice === 'local') {
        await expect(
          page.getByRole('spinbutton', {
            name: 'Quantity for row 3',
            exact: true,
          })
        ).toHaveValue('2');
      } else {
        await expect(
          page.getByRole('spinbutton', {
            name: 'Quantity for row 3',
            exact: true,
          })
        ).toHaveCount(0);
      }
      await capture(`Explicitly kept ${choice} product list`);
    });
  }

  test('a failed background read keeps edits available and a later refresh recovers', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My edit survives an outage');
    await savedSupply.failReads(true);
    await returnToEditor(page);
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My edit survives an outage');
    await expect(
      page.getByRole('button', { name: 'Save draft' })
    ).toBeEnabled();
    await capture('Failed refetch — editor and local text remain');
    await savedSupply.failReads(false);
    await savedSupply.replace({ supplyNumber: 'SUP-RECOVERED' });
    await returnToEditor(page);
    await reviewUpdates(page);
    await page
      .getByRole('dialog', { name: 'Review updates' })
      .getByRole('button', { name: 'Apply changes' })
      .click();
    await expect(
      page.getByRole('textbox', { name: 'Supply number', exact: true })
    ).toHaveValue('SUP-RECOVERED');
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My edit survives an outage');
    await capture('Recovered refresh — local text preserved');
  });

  test('an open finalize confirmation is disabled if another session finalizes first', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My unsaved comment');
    await page
      .getByRole('button', { name: 'Finalize supply', exact: true })
      .click();
    await savedSupply.replace({ status: 'COMPLETED' });
    await returnToEditor(page);
    await page
      .getByRole('dialog', { name: 'Supply finalized', exact: true })
      .getByRole('button', { name: 'Close', exact: true })
      .click();
    const confirmation = page.getByRole('dialog', {
      name: 'Finalize supply',
      exact: true,
    });
    await expect(
      confirmation.getByRole('button', { name: 'Finalize supply', exact: true })
    ).toBeDisabled();
    await capture('Existing finalize confirmation now blocks submission');
    await confirmation
      .getByRole('button', { name: 'Cancel', exact: true })
      .click();
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My unsaved comment');
  });

  test('a pending save defers refresh and a delayed response cannot replace a newer saved version', async ({
    page,
    savedSupply,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Supplier invoice number' })
      .fill('INV-SAVED');
    const responseGate = Promise.withResolvers<void>();
    await page.route(`**${supplyApiPath}`, async (route) => {
      if (route.request().method() !== 'PATCH') {
        await route.fallback();
        return;
      }
      await responseGate.promise;
      await route.fulfill({
        json: {
          ...draftSupply,
          version: 2,
          supplierInvoiceNumber: 'INV-SAVED',
        },
      });
    });
    try {
      const request = waitForPatch(page);
      await page.getByRole('button', { name: 'Save draft' }).click();
      expect((await request).postDataJSON()).toEqual({
        expectedVersion: 1,
        supplierInvoiceNumber: 'INV-SAVED',
      });
      await expect(
        page.getByRole('button', { name: 'Saving...' })
      ).toBeDisabled();
      await savedSupply.replace({
        version: 3,
        supplyNumber: 'SUP-NEWEST',
        supplierInvoiceNumber: 'INV-SAVED',
      });
      await returnToEditor(page);
      await expect(
        page.getByRole('textbox', { name: 'Supply number', exact: true })
      ).toHaveValue('SUP-009');
      await expect(
        page.getByRole('textbox', { name: 'Supplier invoice number' })
      ).toBeDisabled();
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await capture('Newer data arrived — refresh deferred during save');
      responseGate.resolve();
      await expect(
        page.getByRole('textbox', { name: 'Supply number', exact: true })
      ).toHaveValue('SUP-NEWEST');
      await expect(
        page.getByRole('textbox', { name: 'Supplier invoice number' })
      ).toHaveValue('INV-SAVED');
      await expect(
        page.getByRole('button', { name: 'Save draft' })
      ).toBeEnabled();
      await expect(
        page.getByRole('button', { name: 'Review updates' })
      ).toHaveCount(0);
      await capture('Save finished — editor caught up with the newest version');
    } finally {
      responseGate.resolve();
    }
  });

  test('creating a supply works without a conflict resolver or review action', async ({
    page,
    capture,
  }) => {
    await page.goto('/warehouse/supplies/add');
    await expect(page.getByRole('form', { name: 'Supply' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Review updates' })
    ).toHaveCount(0);
    await page.getByRole('combobox', { name: 'Supplier', exact: true }).click();
    await page
      .getByRole('option', { name: 'Fresh Farms', exact: true })
      .click();
    await page
      .getByRole('combobox', { name: 'Warehouse', exact: true })
      .click();
    await page
      .getByRole('option', { name: 'Main Warehouse', exact: true })
      .click();
    await page
      .getByRole('textbox', { name: 'Supply number', exact: true })
      .fill('SUP-NEW');
    await capture('Create form — ordinary save and finalize actions');
    const request = page.waitForRequest(
      (candidate) =>
        new URL(candidate.url()).pathname === '/api/backend/api/v1/supplies' &&
        candidate.method() === 'POST'
    );
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      supplierId: 1,
      warehouseId: 2,
      supplyNumber: 'SUP-NEW',
      status: 'DRAFT',
      supplyEntries: [],
    });
    await expect(page).toHaveURL(supplyPath);
    await expect(
      page.getByRole('textbox', { name: 'Supply number', exact: true })
    ).toHaveValue('SUP-NEW');
    await capture('Created draft opens in the editor');
  });
});
