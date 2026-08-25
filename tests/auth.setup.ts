import { test } from '@playwright/test';

/**
 * ONE-TIME Google session capture.  Run with:  npm run auth
 *
 * Why: Playwright cannot type into Google's password / 2FA screen reliably
 * (bot detection + CAPTCHA). So we sign into GOOGLE ONCE by hand, and save the
 * browser session to auth/user.json. The real signup test then reuses that
 * session, so clicking "Google" jumps straight to the account chooser instead
 * of a password prompt.
 *
 * IMPORTANT: sign into Google only. Do NOT click "Create Account" here — leave
 * the app onboarding UNfinished so the signup test can automate it.
 */

test('capture Google session', async ({ page }) => {
  await page.goto('/');

  // Open the "Create your account" modal.
  await page.getByRole('button', { name: 'Sign up' }).click();

  // Start Google SSO.
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Google' }).click();

  console.log('\n>>> Sign into your Google TEST account by hand in the window.');
  console.log('>>> STOP when the "I am a..." onboarding screen appears (Image 4).');
  console.log('>>> Do NOT click "Create Account" — the test will do that.\n');
  
  await page.getByText(/I am a/i).waitFor({ timeout: 180_000 });

  await page.context().storageState({ path: 'auth/user.json' });
  console.log('\n>>> Google session saved to auth/user.json — now run: npm test\n');
});
