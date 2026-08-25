import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: { timeout: 15_000 },
  reporter: [['html', { open: 'never' }], ['list']],
 use: {
  baseURL: 'https://dev.cplk.org',
  channel: 'chrome',
  launchOptions: {
    args: ['--disable-blink-features=AutomationControlled'],
    ignoreDefaultArgs: ['--enable-automation'],
  },
  trace: 'on-first-retry',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},
  projects: [
    { name: 'auth-setup', testMatch: /auth\.setup\.ts/, use: { ...devices['Desktop Chrome'] } },
    // { name: 'journey',    testMatch: /signup\.spec\.ts/, use: { ...devices['Desktop Chrome'], storageState: 'auth/user.json' } },
    // { name: 'journey', testMatch: /(signup|create-listing)\.spec\.ts/, use: { ...devices['Desktop Chrome'], storageState: 'auth/user.json' } },
    {name: 'journey',testMatch: /.*\.spec\.ts/,  use: { ...devices['Desktop Chrome'], storageState: 'auth/user.json' },
}
  ],
});