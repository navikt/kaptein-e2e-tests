import { expect, test } from '@playwright/test';
import { endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { getParsedUrl, UI_DOMAIN } from './functions';

const ISO_DATE_FORMAT = 'yyyy-MM-dd';
const URL_HAS_F = /[?&]f=/;
const URL_HAS_TD_LEDIGE = /[?&]td=ledige/;
const URL_HAS_TD_TILDELTE = /[?&]td=tildelte/;
const URL_HAS_TD_ALL = /[?&]td=all/;
const now = new Date();

const startOfLastMonth = format(startOfMonth(subMonths(now, 1)), ISO_DATE_FORMAT);
const endOfLastMonth = format(endOfMonth(subMonths(now, 1)), ISO_DATE_FORMAT);
const startOfLastTertial = format(startOfMonth(subMonths(now, 4)), ISO_DATE_FORMAT);
const endOfLastTertial = format(endOfMonth(subMonths(now, 1)), ISO_DATE_FORMAT);
const startOfLastYear = format(startOfYear(subYears(now, 1)), ISO_DATE_FORMAT);
const endOfLastYear = format(endOfYear(subYears(now, 1)), ISO_DATE_FORMAT);

test.describe('Filters', () => {
  test.describe('"Nullstill filtre"', () => {
    test('clears date range params on ferdigstilte', async ({ page }) => {
      // Use a date before the picker's lower bound (2015-01-01) — the picker
      // treats it as out of range, so the filter initialises to null, which is
      // the same as the post-reset state and is not written back after clicking.
      await page.goto(`${UI_DOMAIN}/ferdigstilte?f=2000-01-01&t=2000-12-31`);

      await page.getByRole('button', { name: 'Nullstill filtre' }).click();
      // f and t default to null — they are not written back after reset.
      await expect(page).not.toHaveURL(URL_HAS_F);
      expect(getParsedUrl(page.url()).pathname).toBe('/ferdigstilte');
    });

    test('is present on every data page', async ({ page }) => {
      const paths = [
        '/aktive',
        '/ferdigstilte',
        '/saksstroem',
        '/behandlingstid',
        '/aktive-saker-i-tr',
        '/ferdigstilte-saker-i-tr',
      ];

      for (const path of paths) {
        await page.goto(`${UI_DOMAIN}${path}`);
        await expect(page.getByRole('button', { name: 'Nullstill filtre' })).toBeVisible({ timeout: 10_000 });
      }
    });
  });

  test.describe('Tildeling', () => {
    // Aksel ToggleGroup.Item renders with role="radio".
    test('selecting "Ledige" sets td=ledige in URL', async ({ page }) => {
      await page.goto(`${UI_DOMAIN}/aktive`);
      await page.waitForLoadState('networkidle');
      await page.getByRole('radio', { name: 'Ledige', exact: true }).click();
      await expect(page).toHaveURL(URL_HAS_TD_LEDIGE);
      expect(getParsedUrl(page.url()).searchParams.get('td')).toBe('ledige');
    });

    test('selecting "Tildelte" sets td=tildelte in URL', async ({ page }) => {
      await page.goto(`${UI_DOMAIN}/aktive`);
      await page.waitForLoadState('networkidle');
      await page.getByRole('radio', { name: 'Tildelte', exact: true }).click();
      await expect(page).toHaveURL(URL_HAS_TD_TILDELTE);
      expect(getParsedUrl(page.url()).searchParams.get('td')).toBe('tildelte');
    });

    test('selecting "Alle" sets td=all in URL', async ({ page }) => {
      await page.goto(`${UI_DOMAIN}/aktive?td=ledige`);
      await page.waitForLoadState('networkidle');
      await page.getByRole('radio', { name: 'Alle', exact: true }).click();
      // td=all is written to the URL explicitly even when it is the default value.
      await expect(page).toHaveURL(URL_HAS_TD_ALL);
      expect(getParsedUrl(page.url()).searchParams.get('td')).toBe('all');
    });
  });

  test.describe('Date range presets', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${UI_DOMAIN}/ferdigstilte`);
      await page.waitForLoadState('networkidle');
    });

    test('"Forrige måned" sets f and t to last month', async ({ page }) => {
      await page.getByRole('button', { name: 'Forrige måned' }).click();
      await expect(page).toHaveURL(new RegExp(`f=${startOfLastMonth}`));
      expect(getParsedUrl(page.url()).searchParams.get('t')).toBe(endOfLastMonth);
    });

    test('"I fjor" sets f and t to previous year', async ({ page }) => {
      await page.getByRole('button', { name: 'I fjor' }).click();
      await expect(page).toHaveURL(new RegExp(`f=${startOfLastYear}`));
      expect(getParsedUrl(page.url()).searchParams.get('t')).toBe(endOfLastYear);
    });

    test('"Siste tertial" sets f and t to last tertial', async ({ page }) => {
      await page.getByRole('button', { name: 'Siste tertial' }).click();
      await expect(page).toHaveURL(new RegExp(`f=${startOfLastTertial}`));
      expect(getParsedUrl(page.url()).searchParams.get('t')).toBe(endOfLastTertial);
    });
  });

  test.describe('User menu', () => {
    test('opens on click and shows logout link', async ({ page }) => {
      await page.goto(UI_DOMAIN);
      await page.getByTestId('user-menu-button').click();
      const logoutLink = page.getByTestId('logout-link');
      await expect(logoutLink).toBeVisible();
      await expect(logoutLink).toHaveAttribute('href', '/oauth2/logout');
    });
  });
});
