import { Page, expect } from "@playwright/test";

//Google TEST account email.
const TEST_GOOGLE_EMAIL = "asangikanethmini25@gmail.com";
const firstName = "QA";
const lastName = "Owner" + Date.now();

//Open website
export async function openSite(page: Page) {
  await page.goto("/");
  await expect(page).toHaveTitle(
    /Commercial Property Sri Lanka | CommercialProperty.lk/i,
  );
}

//Open Create Your Account Page(Sign Up Page)
export async function openSignUpPage(page: Page) {
  await page.getByRole("button", { name: "Sign up" }).click();

  await expect(
    page.getByRole("heading", { name: "Create your account" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Google" })).toBeVisible();
  await expect(page.getByRole("button", { name: "LinkedIn" })).toBeVisible();
}

//Open Create Your Account Page(Sign In Page)
export async function openSignInPage(page: Page) {
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Google" })).toBeVisible();
  await expect(page.getByRole("link", { name: "LinkedIn" })).toBeVisible();
}

//Open Google SSO Page
export async function openSSOPage(page: Page) {
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Google" }).click();
  await expect(page.getByText(/Sign in with Google/i)).toBeVisible();
}

//Cancel the Google consent flow and return to the signup screen.
export async function cancelGoogleConsent(page: Page) {
  const cancelControl = page
    .getByRole("button", { name: /cancel|deny|decline/i })
    .or(page.getByRole("link", { name: /cancel|deny|decline/i }))
    .or(page.getByText(/cancel|deny|decline/i));

  await cancelControl.first().click();
  await expect(
    page.getByRole("heading", { name: "Create your account" }),
  ).toBeVisible();
}

//Choose Google Account
export async function chooseAccount(page: Page) {
  const account = page.getByText(TEST_GOOGLE_EMAIL);
  if (await account.isVisible({ timeout: 10_000 }).catch(() => false)) {
    await account.click();
  }
}

export async function openCreateAccountPage(page: Page) {
  await expect(page.getByText(/Create your account/i)).toBeVisible();
}

//Select Account Type
export async function selectAccountType(page: Page) {
  await page.getByText("Property Owner", { exact: true }).click();
}

//Fill Profile Details
export async function completeProfile(page: Page) {
  await page.getByLabel(/first name/i).fill(firstName);
  await page.getByLabel(/last name/i).fill(lastName);
  //Mobile number is optional — left out on purpose.
}

//Create Account
export async function createProfile(page: Page) {
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Create Account" }).click();
}

//Open Dashboard
export async function openDashboard(page: Page) {
  const dashboardHeading = page.getByRole("heading", {
    name: new RegExp(`welcome back,?\\s*${firstName}`, "i"),
  });

  await expect(dashboardHeading).toBeVisible({
    timeout: 30_000,
  });
}
