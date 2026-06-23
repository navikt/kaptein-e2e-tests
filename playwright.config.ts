import { slackReporter, statusReporter } from '@navikt/klage-e2e-reporters';
import { defineConfig } from '@playwright/test';

const isInNais = process.env.CONFIG === 'nais';

export const storageState = isInNais ? '/tmp/state.json' : './state.json';

const baseConfig = defineConfig({
  name: 'Kaptein',
  timeout: 60_000,
  globalTimeout: 300_000,
  globalSetup: './setup/global-setup.ts',

  testDir: './tests',
  testMatch: '**/*.test.ts',
  fullyParallel: true,

  use: {
    locale: 'no-NB',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    storageState,
    trace: 'on',
    video: 'on',
    screenshot: 'on',
  },
});

const local = defineConfig({
  ...baseConfig,

  maxFailures: 1,
  outputDir: './test-results',
  reporter: [['list']],
  retries: 0,
});

const nais = defineConfig({
  ...baseConfig,

  maxFailures: 0,
  outputDir: '/tmp/test-results',
  reporter: [
    ['list'],
    slackReporter({
      botName: 'Kaptein E2E',
      iconUrl: 'navikt/kaptein/main/frontend/assets/android-chrome-144x144.png',
    }),
    statusReporter({ name: 'Kaptein E2E' }),
  ],
  retries: 1,
});

export default isInNais ? nais : local;
