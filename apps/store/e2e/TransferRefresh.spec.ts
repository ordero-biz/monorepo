import type { Page } from '@playwright/test';
import {
  draftTransfer,
  eastWarehouse,
  expect,
  mainWarehouse,
  returnToEditor,
  test,
  transferApiPath,
  transferPath,
  westWarehouse,
} from './fixtures/transfer';

test.use({
  viewport: { width: 1440, height: 1000 },
  video: { mode: 'on', size: { width: 1440, height: 1000 } },
  trace: 'on',
  launchOptions: { slowMo: Number(process.env.PLAYWRIGHT_SLOW_MO ?? 0) },
});

const openEditor = async (page: Page) => {
  await page.goto(transferPath);
  await expect(page.getByRole('form', { name: 'Transfer' })).toBeVisible();
  await expect(
    page.getByRole('textbox', { name: 'Name', exact: true })
  ).toHaveValue('TR-009');
  // SSR exposes the form before hydration finishes. Opening a real control
  // verifies client readiness without changing values or making the form dirty.
  await page
    .getByRole('combobox', { name: 'From warehouse', exact: true })
    .click();
  await expect(
    page.getByRole('option', { name: mainWarehouse.name, exact: true })
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toHaveCount(0);
};

const reviewUpdates = async (page: Page) => {
  const notice = page.getByRole('dialog', {
    name: 'Transfer changed',
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
      new URL(request.url()).pathname === transferApiPath &&
      request.method() === 'PATCH'
  );

// Use the real application, server prefetch, BFF and focus refetch. The backend
// fixture supplies deterministic records and a separate session for each test.
test.describe('Transfer refresh and conflict resolution', () => {
  test('an already started transfer opens directly in the read-only page', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await savedTransfer.replace({
      status: 'IN_TRANSIT',
      comment: 'Started before opening',
    });
    await page.goto(transferPath);

    await expect(page.getByText('In transit', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Details for this transfer status are not available yet.')
    ).toBeVisible();
    await expect(page.getByRole('form', { name: 'Transfer' })).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Save draft' })).toHaveCount(
      0
    );
    await capture('Already started — full read-only page');
  });

  test('a pristine editor becomes a read-only page when another session starts it', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await capture('Before starting — pristine draft');
    await savedTransfer.replace({
      status: 'IN_TRANSIT',
      comment: 'Started in another session',
    });
    await returnToEditor(page);

    await expect(page.getByText('In transit', { exact: true })).toBeVisible();
    await expect(
      page.getByText('Details for this transfer status are not available yet.')
    ).toBeVisible();
    await expect(page.getByRole('form', { name: 'Transfer' })).toHaveCount(0);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await capture('After refetch — full read-only page');
  });

  test('a dirty editor announces external start and preserves edits with saving blocked', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await test.step('Keep unsaved text and an unfinished added row', async () => {
      await page
        .getByRole('textbox', { name: 'Comment', exact: true })
        .fill('My unsaved comment');
      await page
        .getByRole('textbox', { name: 'Name', exact: true })
        .fill('MY-UNSAVED-TRANSFER');
      await page.getByRole('button', { name: '+ Add another product' }).click();
      await page
        .getByRole('textbox', { name: 'Comment for row 2' })
        .fill('Unfinished new product');
    });
    await savedTransfer.replace({
      status: 'IN_TRANSIT',
      comment: 'Final saved comment',
    });
    await returnToEditor(page);
    const notice = page.getByRole('dialog', {
      name: 'Transfer started',
      exact: true,
    });
    await expect(notice).toHaveAccessibleDescription(
      'This transfer was started elsewhere. Your unsaved edits remain on this page, but can no longer be saved.'
    );
    await expect(notice.getByRole('button')).toHaveCount(1);
    await capture('Unsaved edits — start notice');
    await notice.getByRole('button', { name: 'Close', exact: true }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My unsaved comment');
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true })
    ).toHaveValue('MY-UNSAVED-TRANSFER');
    await expect(
      page.getByRole('textbox', { name: 'Comment for row 2' })
    ).toHaveValue('Unfinished new product');
    await expect(
      page.getByRole('button', { name: 'Save draft' })
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Transfer', exact: true })
    ).toBeDisabled();
    await capture('Back to the preserved draft — save actions disabled');
    await page.getByRole('button', { name: 'Review updates' }).click();
    await expect(notice).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });

  test('external start replaces open conflict choices with the start notice', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My unsaved comment');
    await savedTransfer.replace({ comment: 'Saved elsewhere' });
    await returnToEditor(page);
    await reviewUpdates(page);
    const conflicts = page.getByRole('dialog', {
      name: 'Review updates',
    });
    await conflicts
      .getByRole('radio', { name: 'Keep my changes: My unsaved comment' })
      .check();

    await savedTransfer.replace({ status: 'IN_TRANSIT' });
    await returnToEditor(page);
    const notice = page.getByRole('dialog', {
      name: 'Transfer started',
      exact: true,
    });
    await expect(notice).toBeVisible();
    await expect(conflicts).toHaveCount(0);
    await capture('Start supersedes open conflict choices');
    await notice.getByRole('button', { name: 'Close', exact: true }).click();

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My unsaved comment');
    await expect(
      page.getByRole('button', { name: 'Save draft' })
    ).toBeDisabled();
    await expect(
      page.getByRole('button', { name: 'Transfer', exact: true })
    ).toBeDisabled();
  });

  test('starting your own draft replaces the editor with the read-only page', async ({
    page,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('button', { name: 'Transfer', exact: true })
      .click();
    const confirmation = page.getByRole('dialog', {
      name: 'Start transfer',
      exact: true,
    });
    await capture('Confirm start transfer');
    const request = waitForPatch(page);
    await confirmation
      .getByRole('button', { name: 'Start transfer', exact: true })
      .click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 1,
      status: 'IN_TRANSIT',
    });
    await expect(page.getByRole('form', { name: 'Transfer' })).toHaveCount(0);
    await expect(page.getByText('In transit', { exact: true })).toBeVisible();
    await capture('Your started transfer — full read-only page');
  });

  test('a pristine editor adopts new saved values and saves against their version', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await savedTransfer.replace({
      transferNumber: 'TR-UPDATED',
      comment: 'Changed elsewhere',
    });
    await returnToEditor(page);
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true })
    ).toHaveValue('TR-UPDATED');
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('Changed elsewhere');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: 'Review updates' })
    ).toHaveCount(0);
    await capture('Pristine editor automatically refreshed');
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('NOTE-AFTER-REFRESH');
    const request = waitForPatch(page);
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 2,
      comment: 'NOTE-AFTER-REFRESH',
    });
    await expect(
      page.getByText('Transfer draft saved.', { exact: true })
    ).toBeVisible();
  });

  test('independent edits survive repeated refreshes and save with the latest accepted version', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('MY-UNSAVED-COMMENT');
    await savedTransfer.replace({ transferNumber: 'TR-SECOND' });
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
      'This action does not save or start this transfer.'
    );
    await expect(summary.getByText('TR-009', { exact: true })).toBeVisible();
    await expect(
      summary.getByText('TR-SECOND', { exact: true })
    ).toBeVisible();
    await expect(review.getByRole('radiogroup')).toHaveCount(0);
    await expect(page.getByLabel(/^Name/)).toHaveValue('TR-009');
    await capture('Automatic updates are previewed before application');
    await review.getByRole('button', { name: 'Cancel' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true })
    ).toHaveValue('TR-009');
    await page.getByRole('button', { name: 'Review updates' }).click();
    await expect(review).toBeVisible();
    await expect(
      page.getByRole('dialog', { name: 'Transfer changed', exact: true })
    ).toHaveCount(0);
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true })
    ).toHaveValue('TR-SECOND');
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('MY-UNSAVED-COMMENT');
    await savedTransfer.replace({ transferNumber: 'TR-THIRD' });
    await returnToEditor(page);
    await reviewUpdates(page);
    await expect(page.getByLabel(/^Name/)).toHaveValue('TR-SECOND');
    await expect(summary.getByText('TR-THIRD', { exact: true })).toBeVisible();
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true })
    ).toHaveValue('TR-THIRD');
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('MY-UNSAVED-COMMENT');
    await capture('Two refreshes — local comment is still preserved');
    const request = waitForPatch(page);
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 3,
      comment: 'MY-UNSAVED-COMMENT',
    });
    await expect(
      page.getByText('Transfer draft saved.', { exact: true })
    ).toBeVisible();
  });

  test('a newer saved version with no field updates keeps edits and requires explicit acceptance', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My unsaved note');
    await savedTransfer.replace({});
    await returnToEditor(page);
    await page
      .getByRole('dialog', { name: 'Transfer changed', exact: true })
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
      'This action does not save or start this transfer.'
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
      page.getByText('Transfer draft saved.', { exact: true })
    ).toBeVisible();
  });

  test('a newer version updates an open automatic review and can introduce conflicts', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('MY-COMMENT');
    await savedTransfer.replace({ transferNumber: 'TR-SECOND' });
    await returnToEditor(page);
    await reviewUpdates(page);
    const review = page.getByRole('dialog', { name: 'Review updates' });
    await expect(review).toHaveAccessibleDescription(
      'Review the saved updates below. Your unsaved edits will be kept.'
    );
    await expect(review.getByRole('radiogroup')).toHaveCount(0);

    await savedTransfer.replace({
      transferNumber: 'TR-THIRD',
      comment: 'SAVED-COMMENT',
    });
    await returnToEditor(page);
    await expect(review).toHaveAccessibleDescription(
      'Review the saved updates below, then choose which values to keep where both versions changed.'
    );
    await expect(
      page.getByRole('dialog', { name: 'Transfer changed', exact: true })
    ).toHaveCount(0);
    await expect(
      review
        .getByRole('region', { name: 'Updates to apply' })
        .getByText('TR-THIRD', { exact: true })
    ).toBeVisible();
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      review.getByRole('radiogroup', { name: 'Comment' })
    ).toHaveAccessibleDescription('Choose which value to keep.');
    await expect(page.getByLabel(/^Name/)).toHaveValue('TR-009');
    await capture('New version adds a conflict alongside automatic updates');
    await review
      .getByRole('radio', { name: 'Keep my changes: MY-COMMENT' })
      .check();
    await review.getByRole('button', { name: 'Apply changes' }).click();
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true })
    ).toHaveValue('TR-THIRD');
    const request = waitForPatch(page);
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      expectedVersion: 3,
      comment: 'MY-COMMENT',
    });
    await expect(
      page.getByText('Transfer draft saved.', { exact: true })
    ).toBeVisible();
  });

  for (const choice of ['Keep my changes', 'Use saved value'] as const) {
    test(`conflicting text supports "${choice}" while retaining unrelated edits`, async ({
      page,
      savedTransfer,
      capture,
    }) => {
      await openEditor(page);
      await page
        .getByRole('textbox', { name: 'Comment', exact: true })
        .fill('My conflicting comment');
      await page
        .getByRole('textbox', { name: 'Name', exact: true })
        .fill('MY-NAME');
      await page
        .getByRole('combobox', { name: 'To warehouse', exact: true })
        .click();
      await page
        .getByRole('option', { name: westWarehouse.name, exact: true })
        .click();
      await savedTransfer.replace({
        comment: 'Saved conflicting comment',
        transferNumber: 'SAVED-NAME',
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
      const nameChoices = conflict.getByRole('radiogroup', {
        name: 'Name',
      });
      const commentChoices = conflict.getByRole('radiogroup', {
        name: 'Comment',
      });
      const requiredMessage = 'Choose which value to keep.';
      await apply.click();
      await expect(nameChoices).toHaveAccessibleDescription(requiredMessage);
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
      await expect(nameChoices).toHaveAccessibleDescription(requiredMessage);
      await capture('A choice is required for every conflicting field');
      await nameChoices
        .getByRole('radio', { name: 'Use saved value: SAVED-NAME' })
        .check();
      await expect(
        conflict.getByText(requiredMessage, { exact: true })
      ).toHaveCount(0);
      await apply.focus();
      await page.keyboard.press('Enter');
      await expect(
        page.getByRole('textbox', { name: 'Name', exact: true })
      ).toHaveValue('SAVED-NAME');
      await expect(
        page.getByRole('textbox', { name: 'Comment', exact: true })
      ).toHaveValue(expectedComment);
      await expect(
        page.getByRole('combobox', { name: 'To warehouse', exact: true })
      ).toHaveValue(westWarehouse.name);
      await capture(`${choice} applied — unrelated destination preserved`);
      const request = waitForPatch(page);
      await page.getByRole('button', { name: 'Save draft' }).click();
      expect((await request).postDataJSON()).toEqual({
        expectedVersion: 2,
        destinationWarehouseId: westWarehouse.id,
        ...(choice === 'Keep my changes'
          ? { comment: 'My conflicting comment' }
          : {}),
      });
      await expect(
        page.getByText('Transfer draft saved.', { exact: true })
      ).toBeVisible();
    });
  }

  test('dismissing and cancelling a review preserves edits and the footer can reopen it', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My ongoing edit');
    await savedTransfer.replace({ comment: 'Saved competing edit' });
    await returnToEditor(page);
    await page
      .getByRole('dialog', { name: 'Transfer changed', exact: true })
      .getByRole('button', { name: 'Keep editing' })
      .click();
    const actions = page.getByRole('complementary', {
      name: 'Transfer creation actions',
    });
    await expect(
      actions.getByRole('button', { name: 'Review updates' })
    ).toBeVisible();
    await expect(
      actions.getByRole('button', { name: 'Save draft' })
    ).toBeEnabled();
    await capture('Review action next to draft and transfer');
    await returnToEditor(page);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await actions.getByRole('button', { name: 'Review updates' }).click();
    await expect(
      page.getByRole('dialog', { name: 'Transfer changed', exact: true })
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
    await savedTransfer.replace({ comment: 'Another newer edit' });
    await returnToEditor(page);
    await expect(
      page.getByRole('dialog', { name: 'Transfer changed', exact: true })
    ).toBeVisible();
  });

  test('a newer saved revision clears choices made in an open conflict dialog', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My conflicting comment');
    await savedTransfer.replace({ comment: 'Saved version two' });
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
    await savedTransfer.replace({ comment: 'Saved version three' });
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
      page.getByText('Transfer draft saved.', { exact: true })
    ).toBeVisible();
  });

  test('new local rows are appended after refreshed saved rows, including unfinished rows', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page.getByRole('button', { name: '+ Add another product' }).click();
    await page.getByRole('combobox', { name: 'Product for row 2' }).click();
    await page
      .getByRole('option', { name: /Lentils · LENTILS/ })
      .click();
    await page
      .getByRole('textbox', { name: 'Comment for row 2' })
      .fill('My unfinished new row');
    await capture('Locally added Lentils row');
    await savedTransfer.replace({
      transferEntries: [
        draftTransfer.transferEntries[0],
        {
          ...draftTransfer.transferEntries[0],
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
      review.getByText('Products to transfer', { exact: true })
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
      rows.nth(3).getByRole('cell', { name: /Not entered/ })
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
      savedTransfer,
      capture,
    }) => {
      if (choice === 'server') {
        await page.setViewportSize({ width: 390, height: 844 });
      }
      const saved = await savedTransfer.replace({
        transferEntries: [
          draftTransfer.transferEntries[0],
          {
            ...draftTransfer.transferEntries[0],
            id: 18,
            productVariant: {
              barcode: '',
              id: 12,
              name: 'Oats',
              sku: 'OATS',
            },
          },
          {
            ...draftTransfer.transferEntries[0],
            id: 19,
            productVariant: {
              barcode: '',
              id: 13,
              name: 'Lentils',
              sku: 'LENTILS',
            },
          },
        ],
      });
      await openEditor(page);
      await page
        .getByRole('spinbutton', { name: 'Quantity for row 1', exact: true })
        .fill('7');
      await savedTransfer.replace({
        transferEntries: saved.transferEntries
          .slice(0, 2)
          .map((entry, index) =>
            index === 0 ? { ...entry, quantity: 4 } : entry
          ),
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
        const savedQty = savedTable
          .getByRole('cell', { name: '2 Bag (bag)', exact: true })
          .last();
        await savedQty.scrollIntoViewIfNeeded();
        await expect(savedQty).toBeInViewport();
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

  for (const choice of ['local', 'server'] as const) {
    test(`different source warehouse and product edits resolve together when keeping the ${choice} product list`, async ({
      page,
      savedTransfer,
      capture,
    }) => {
      await openEditor(page);
      await page
        .getByRole('spinbutton', { name: 'Quantity for row 1', exact: true })
        .fill('5');
      await savedTransfer.replace({
        sourceWarehouse: {
          id: eastWarehouse.id,
          name: eastWarehouse.name,
          status: eastWarehouse.status,
        },
        destinationWarehouse: {
          id: westWarehouse.id,
          name: westWarehouse.name,
          status: westWarehouse.status,
        },
        transferEntries: [
          {
            ...draftTransfer.transferEntries[0],
            id: 25,
            productVariant: {
              id: 12,
              name: 'Oats',
              sku: 'OATS',
              barcode: '',
            },
            quantity: 3,
          },
        ],
      });
      await returnToEditor(page);
      await reviewUpdates(page);
      const conflict = page.getByRole('dialog', {
        name: 'Review updates',
      });
      await expect(
        conflict.getByText(
          'Products belong to the source warehouse. Choose one source warehouse and its complete product list.'
        )
      ).toBeVisible();
      await expect(
        conflict.getByRole('radiogroup', { name: 'From warehouse' })
      ).toHaveCount(0);
      await conflict
        .getByRole('radio', {
          name:
            choice === 'local'
              ? 'Your product list (1 row)'
              : 'Saved product list (1 row)',
        })
        .check();
      await conflict.getByRole('button', { name: 'Apply changes' }).click();

      await expect(
        page.getByRole('combobox', { name: 'From warehouse', exact: true })
      ).toHaveValue(
        choice === 'local' ? mainWarehouse.name : eastWarehouse.name
      );
      await expect(
        page.getByRole('combobox', { name: 'To warehouse', exact: true })
      ).toHaveValue(westWarehouse.name);
      await expect(
        page.getByRole('combobox', { name: 'Product for row 1' })
      ).toHaveValue(choice === 'local' ? 'Rice · RICE' : 'Oats · OATS');
      await expect(
        page.getByRole('spinbutton', {
          name: 'Quantity for row 1',
          exact: true,
        })
      ).toHaveValue(choice === 'local' ? '5' : '3');
      await capture(
        `Coupled source warehouse and product list resolved with ${choice}`
      );
    });
  }

  test('a failed background read keeps edits available and a later refresh recovers', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My edit survives an outage');
    await savedTransfer.failReads(true);
    await returnToEditor(page);
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My edit survives an outage');
    await expect(
      page.getByRole('button', { name: 'Save draft' })
    ).toBeEnabled();
    await capture('Failed refetch — editor and local text remain');
    await savedTransfer.failReads(false);
    await savedTransfer.replace({ transferNumber: 'TR-RECOVERED' });
    await returnToEditor(page);
    await reviewUpdates(page);
    await page
      .getByRole('dialog', { name: 'Review updates' })
      .getByRole('button', { name: 'Apply changes' })
      .click();
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true })
    ).toHaveValue('TR-RECOVERED');
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My edit survives an outage');
    await capture('Recovered refresh — local text preserved');
  });

  test('an open start confirmation is disabled if another session starts first', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('My unsaved comment');
    await page
      .getByRole('button', { name: 'Transfer', exact: true })
      .click();
    await savedTransfer.replace({ status: 'IN_TRANSIT' });
    await returnToEditor(page);
    await page
      .getByRole('dialog', { name: 'Transfer started', exact: true })
      .getByRole('button', { name: 'Close', exact: true })
      .click();
    const confirmation = page.getByRole('dialog', {
      name: 'Start transfer',
      exact: true,
    });
    await expect(
      confirmation.getByRole('button', { name: 'Start transfer', exact: true })
    ).toBeDisabled();
    await capture('Existing start confirmation now blocks submission');
    await confirmation
      .getByRole('button', { name: 'Cancel', exact: true })
      .click();
    await expect(
      page.getByRole('textbox', { name: 'Comment', exact: true })
    ).toHaveValue('My unsaved comment');
  });

  test('a pending save defers refresh and a delayed response cannot replace a newer saved version', async ({
    page,
    savedTransfer,
    capture,
  }) => {
    await openEditor(page);
    await page
      .getByRole('textbox', { name: 'Comment', exact: true })
      .fill('COMMENT-SAVED');
    const responseGate = Promise.withResolvers<void>();
    await page.route(`**${transferApiPath}`, async (route) => {
      if (route.request().method() !== 'PATCH') {
        await route.fallback();
        return;
      }
      await responseGate.promise;
      await route.fulfill({
        json: {
          ...draftTransfer,
          version: 2,
          comment: 'COMMENT-SAVED',
        },
      });
    });
    try {
      const request = waitForPatch(page);
      await page.getByRole('button', { name: 'Save draft' }).click();
      expect((await request).postDataJSON()).toEqual({
        expectedVersion: 1,
        comment: 'COMMENT-SAVED',
      });
      await expect(
        page.getByRole('button', { name: 'Saving...' })
      ).toBeDisabled();
      await savedTransfer.replace({
        version: 3,
        transferNumber: 'TR-NEWEST',
        comment: 'COMMENT-SAVED',
      });
      await returnToEditor(page);
      await expect(
        page.getByRole('textbox', { name: 'Name', exact: true })
      ).toHaveValue('TR-009');
      await expect(
        page.getByRole('textbox', { name: 'Comment', exact: true })
      ).toBeDisabled();
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await capture('Newer data arrived — refresh deferred during save');
      responseGate.resolve();
      await expect(
        page.getByRole('textbox', { name: 'Name', exact: true })
      ).toHaveValue('TR-NEWEST');
      await expect(
        page.getByRole('textbox', { name: 'Comment', exact: true })
      ).toHaveValue('COMMENT-SAVED');
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

  test('creating a transfer works without a conflict resolver or review action', async ({
    page,
    capture,
  }) => {
    await page.goto('/warehouse/transfers/add');
    await expect(page.getByRole('form', { name: 'Transfer' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Review updates' })
    ).toHaveCount(0);
    await page
      .getByRole('combobox', { name: 'From warehouse', exact: true })
      .click();
    await page
      .getByRole('option', { name: mainWarehouse.name, exact: true })
      .click();
    await page
      .getByRole('combobox', { name: 'To warehouse', exact: true })
      .click();
    await page
      .getByRole('option', { name: eastWarehouse.name, exact: true })
      .click();
    await page
      .getByRole('textbox', { name: 'Name', exact: true })
      .fill('TR-NEW');
    await capture('Create form — ordinary save and transfer actions');
    const request = page.waitForRequest(
      (candidate) =>
        new URL(candidate.url()).pathname ===
          '/api/backend/api/v1/warehouse-transfers' &&
        candidate.method() === 'POST'
    );
    await page.getByRole('button', { name: 'Save draft' }).click();
    expect((await request).postDataJSON()).toEqual({
      sourceWarehouseId: mainWarehouse.id,
      destinationWarehouseId: eastWarehouse.id,
      transferNumber: 'TR-NEW',
      status: 'DRAFT',
      transferEntries: [],
    });
    await expect(page).toHaveURL(transferPath);
    await expect(
      page.getByRole('textbox', { name: 'Name', exact: true })
    ).toHaveValue('TR-NEW');
    await capture('Created draft opens in the editor');
  });
});
