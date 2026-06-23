import { expect, test } from '@playwright/test';
import { UI_DOMAIN } from './functions';

const URL_IS_FERDIGSTILTE = /\/ferdigstilte/;
const URL_HAS_TD_LEDIGE = /td=ledige/;

const NAV_LINKS = [
  { name: 'Aktive saker', path: '/aktive' },
  { name: 'Ferdigstilte saker', path: '/ferdigstilte' },
  { name: 'Saksstrøm', path: '/saksstroem' },
  { name: 'Behandlingstid', path: '/behandlingstid' },
  { name: 'Aktive saker i TR', path: '/aktive-saker-i-tr' },
  { name: 'Ferdigstilte saker i TR', path: '/ferdigstilte-saker-i-tr' },
] as const;

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(UI_DOMAIN);
  });

  test('Home page shows welcome heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Velkommen til Kaptein', level: 1 })).toBeVisible();
  });

  for (const { name, path } of NAV_LINKS) {
    // InternalHeader.Button as={Link} renders as <a> (role="link"). Wait for
    // Next.js client-side navigation to settle before asserting the URL.
    test(`"${name}" navigates to ${path}`, async ({ page }) => {
      await page.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(`${UI_DOMAIN}${path}`);
    });
  }

  test('Nav links carry existing query params to next page', async ({ page }) => {
    await page.goto(`${UI_DOMAIN}/aktive?td=ledige`);
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: 'Ferdigstilte saker', exact: true }).click();
    await expect(page).toHaveURL(URL_IS_FERDIGSTILTE);
    await expect(page).toHaveURL(URL_HAS_TD_LEDIGE);
  });
});
