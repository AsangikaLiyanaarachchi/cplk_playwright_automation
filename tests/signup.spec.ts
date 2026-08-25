/**Module 01 - Sign up as a Property Owner */

import { test, expect } from "@playwright/test";
import {
  openSite,
  openSignUpPage,
  openSSOPage,
  cancelGoogleConsent,
  chooseAccount,
  selectAccountType,
  completeProfile,
  createProfile,
  openDashboard,
  openCreateAccountPage,
} from "./helpers/signup";

test.describe("Module 01 - Sign up as a Property Owner", () => {
  //CPLK_M1_TC_01: Landing page loads successfully
  test("CPLK_M1_TC_01: Landing page loads successfully", async ({ page }) => {
    await test.step("Navigate to the site", async () => {
      await openSite(page);
    });
  });

  //CPLK_M1_TC_02: Sign Up option is reachable
  test("CPLK_M1_TC_02: Sign Up option is reachable", async ({ page }) => {
    await test.step("1. Navigate to the site", async () => {
      await openSite(page);
    });
    await test.step("2. Open the Sign Up page", async () => {
      await openSignUpPage(page);
    });
  });

  //CPLK_M1_TC_03: Google SSO flow initiates
  test("CPLK_M1_TC_03: Google SSO flow initiates", async ({ page }) => {
    await test.step("1. Navigate to the site", async () => {
      await openSite(page);
    });
    await test.step("2. Open the Sign Up page", async () => {
      await openSignUpPage(page);
    });

    await test.step("3. Open the Google SSO page", async () => {
      await openSSOPage(page);
    });
  });

  //CPLK_M1_TC_04: Sign up with valid Google account
  test("CPLK_M1_TC_04: Sign up with valid Google account", async ({ page }) => {
    await test.step("1. Navigate to the site", async () => {
      await openSite(page);
    });
    await test.step("2. Open the Sign Up page", async () => {
      await openSignUpPage(page);
    });

    await test.step("3. Open the Google SSO page", async () => {
      await openSSOPage(page);
    });
    await test.step("4. Choose the Google account", async () => {
      await chooseAccount(page);
      await openCreateAccountPage(page);
    });
  });

  //CPLK_M1_TC_05: Cancel Google consent and return to Sign Up
  test("CPLK_M1_TC_05: Cancel Google consent returns safely to Sign Up", async ({
    page,
  }) => {
    await test.step("1. Open the Sign Up page", async () => {
      await openSite(page);
      await openSignUpPage(page);
    });

    await test.step("2. Start Google SSO and cancel the consent flow", async () => {
      await openSSOPage(page);
      await cancelGoogleConsent(page);
    });

    await test.step("3. Verify Sign Up is restored without creating an account", async () => {
      await expect(
        page.getByRole("heading", { name: "Create your account" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "Google" })).toBeEnabled();
      await expect(
        page.getByText(/cancelled|canceled|sign.?in was cancelled/i),
      ).toBeVisible();
    });
  });

  //CPLK_M1_TC_06: Proceed without selecting account type
  test("CPLK_M1_TC_06: Proceed without selecting account type", async ({
    page,
  }) => {
    await test.step("1. Sign up with valid Google account", async () => {
      await openSite(page);
      await openSignUpPage(page);
      await openSSOPage(page);
      await chooseAccount(page);
      await openCreateAccountPage(page);
    });
    await test.step("2. Fill mandatory fields without selecting any account type", async () => {
      await completeProfile(page);
    });

    await test.step("3. Create the profile", async () => {
      await createProfile(page);
      await expect(
        page.getByText(/Please select your account type to continue/i),
      ).toBeVisible();
    });
  });

  //CPLK_M1_TC_07: Submit profile with mandatory fields blank
  test("CPLK_M1_TC_07: Submit profile with mandatory fields blank", async ({
    page,
  }) => {
    await test.step("1. Sign up with valid Google account", async () => {
      await openSite(page);
      await openSignUpPage(page);
      await openSSOPage(page);
      await chooseAccount(page);
      await openCreateAccountPage(page);
    });
    await test.step("2. leave mandatory fields blank", async () => {
      await selectAccountType(page);
    });

    await test.step("3. Create the profile", async () => {
      await createProfile(page);
      await expect(
        page.getByText(/First name must be at least 2 characters/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Last name must be at least 2 characters/i),
      ).toBeVisible();
    });
  });

  //CPLK_M1_TC_08: Successful signup redirects to correct dashboard
  test("CPLK_M1_TC_10: Successful signup redirects to correct dashboard", async ({
    page,
  }) => {
    await test.step("1. Navigate to the site", async () => {
      await openSite(page);
    });
    await test.step("2. Open the Sign Up page", async () => {
      await openSignUpPage(page);
    });

    await test.step("3. Open the Google SSO page", async () => {
      await openSSOPage(page);
    });
    await test.step("4. Choose the Google account", async () => {
      await chooseAccount(page);
      await openCreateAccountPage(page);
    });
    await test.step('5. Select "Property Owner" and complete the profile', async () => {
      await selectAccountType(page);
      await completeProfile(page);
      await createProfile(page);
    });
    await test.step("6. Verify account created + redirected to owner dashboard", async () => {
      await openDashboard(page);
    });
  });

  //CPLK_M1_TC_09: Re-signup with an already registered account
  test("CPLK_M1_TC_11: Re-signup with an already registered account", async ({
    page,
  }) => {
    await test.step("1. Navigate to the site", async () => {
      await openSite(page);
    });
    await test.step("2. Open the Sign Up page", async () => {
      await openSignUpPage(page);
    });

    await test.step("3. Open the Google SSO page", async () => {
      await openSSOPage(page);
    });
    await test.step("4. Choose the Google account", async () => {
      await chooseAccount(page);
    });
    await test.step("6. Redirected to owner dashboard", async () => {
      await openDashboard(page);
    });
  });
});


