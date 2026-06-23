import { expect, test } from '@playwright/test';
import { getParsedUrl } from './functions';
import { getLoggedInPage, goToAzure } from './helpers';
import { userSaksbehandler } from './users';

test.describe('Auth', () => {
  // Don't reuse logged-in state for these tests.
  test.use({ storageState: { cookies: [], origins: [] } });

  test('Unauthenticated access redirects to Azure AD login', async ({ page }) => {
    await goToAzure(page);
  });

  test('User is redirected to the requested path after login', async ({ page }) => {
    const path = '/aktive';
    const loggedInPage = await getLoggedInPage(page, userSaksbehandler, path);
    const url = getParsedUrl(loggedInPage.url());
    expect(url.pathname).toBe(path);
  });
});
