import { test, expect } from "@playwright/test";
import { openSite, openSignInPage, openDashboard } from "./helpers/signup";
import {
  LISTING,
  openListingWizard,
  fillTypeAndLocation,
  fillDetails,
  finalizeContactAndImages,
  review,
  openSSOPage,
  chooseAccount,
  openNewPropertyPage,
  clickListYourProperty,
  clickNext,
  clickContinueToPhotos,
  clickReviewListing,
  proceedToPayment,
} from "./helpers/listingFlow";

//Module 02 - Login & Session
test.describe("Module 02 - Login & Session", () => {
  //CPLK_M2_TC_01: Login with newly created account
  test("CPLK_M2_TC_01: Login with newly created account", async ({ page }) => {
    await test.step("1. Navigate to the site", async () => {
      await openSite(page);
    });
    await test.step("2. Open the Login page", async () => {
      await openSignInPage(page);
    });
    await test.step("3. Open the Google SSO page", async () => {
      await openSSOPage(page);
    });
    await test.step("4. Choose the Google account", async () => {
      await chooseAccount(page);
      await openDashboard(page);
    });
  });
});

//Module 03 - Create Property Listing
test.describe("Module 03 - Create Property Listing", () => {
  //CPLK_M3_TC_01: Access new property page (through sign in flow)
  test("CPLK_M3_TC_01: Access new property page ", async ({ page }) => {
    await test.step("1. Login Account", async () => {
      await openSite(page);
      await openSignInPage(page);
      await openSSOPage(page);
      await chooseAccount(page);
      await openDashboard(page);
    });
    await test.step("2. Click on New Property", async () => {
      await page
        .getByRole("link", { name: "New Property", exact: true })
        .click();
    });
    await test.step("3. Open new property page", async () => {
      await openNewPropertyPage(page);
    });
  });

  //CPLK_M3_TC_02: Access new property page (through List your property flow)
  test("CPLK_M3_TC_02: Access new property page ", async ({ page }) => {
    await test.step("1. Navigate to the site", async () => {
      await openSite(page);
    });
    await test.step("2. Click on List your property", async () => {
      await clickListYourProperty(page);
    });
    await test.step("3. Sign in with Google using the registered account.", async () => {
      //await openSignInPage(page);
      await openSSOPage(page);
      await chooseAccount(page);
    });
    await test.step("3. Open new property page", async () => {
      await openNewPropertyPage(page);
    });
  });

  //CPLK_M3_TC_03: Submit listing with mandatory fields empty(Type & Location)
  test("CPLK_M3_TC_03: Submit listing with mandatory fields empty(Type & Location) ", async ({
    page,
  }) => {
    await test.step("1. Access new property page", async () => {
      await openListingWizard(page);
    });
    await test.step("2.Leave mandatory fields blank.", async () => {
      await clickNext(page);
    });
    await test.step("3. Show validation errors.", async () => {
      await expect(
        page.getByText(/Please select a listing type/i),
      ).toBeVisible();
      await expect(
        page.getByText(/Please select a property type/i),
      ).toBeVisible();
      await expect(page.getByText(/Please select a district/i)).toBeVisible();
      await expect(page.getByText(/Please select a city/i)).toBeVisible();
    });
  });

  //CPLK_M3_TC_04: Complete all mandatory listing fields with valid data(Type & Location)
  test("CPLK_M3_TC_04: Complete all mandatory listing fields with valid data ", async ({
    page,
  }) => {
    await test.step("1. Access new property page", async () => {
      await openListingWizard(page);
    });
    await test.step("2.Fill mandatory fields.", async () => {
      await fillTypeAndLocation(page);
    });
    await test.step("3. Submit.", async () => {
      await clickNext(page);
      await expect(
        page.getByRole("heading", { name: "Size & Measurements" }),
      ).toBeVisible();
    });
  });

  //CPLK_M3_TC_05: Submit listing with mandatory fields empty(Details)
  test("CPLK_M3_TC_05: Submit listing with mandatory fields empty(Details) ", async ({
    page,
  }) => {
    await test.step("1. Access new property page", async () => {
      await openListingWizard(page);
    });
    await test.step("2.complete Type & Location.", async () => {
      await fillTypeAndLocation(page);
      await clickNext(page);
    });
    await test.step("3.Leave mandatory fields blank.", async () => {
      await clickContinueToPhotos(page);
    });

    await test.step("3. Show validation errors.", async () => {
      await expect(
        page
          .getByText("Floor area is required", { exact: true })
          .and(page.locator(":visible")),
      ).toBeVisible();
      await expect(
        page
          .getByText("Please enter a valid price", { exact: true })
          .and(page.locator(":visible")),
      ).toBeVisible();
      await expect(
        page
          .getByText("Property title is required", { exact: true })
          .and(page.locator(":visible")),
      ).toBeVisible();
      await expect(
        page
          .getByText("Description is required", { exact: true })
          .and(page.locator(":visible")),
      ).toBeVisible();
    });
  });

  // CPLK_M3_TC_06: Complete all mandatory listing fields with valid data (Details)
  test("CPLK_M3_TC_06: Complete all mandatory listing fields with valid data(Details)", async ({
    page,
  }) => {
    await test.step("1. Access new property page", async () => {
      await openListingWizard(page);
    });

    await test.step("2. Complete Type & Location", async () => {
      await fillTypeAndLocation(page);
      await clickNext(page);
    });

    await test.step("3. Complete mandatory Details fields", async () => {
      await fillDetails(page);
    });

    await test.step("4. Submit and open Finalize", async () => {
      await clickContinueToPhotos(page);
      await expect(
        page.getByRole("button", { name: /review listing/i }),
      ).toBeVisible();
    });
  });

  // CPLK_M3_TC_07: Submit listing with mandatory fields empty (Finalize)
  test("CPLK_M3_TC_07: Submit listing with mandatory fields empty(Finalize)", async ({
    page,
  }) => {
    await test.step("1. Access new property page", async () => {
      await openListingWizard(page);
    });

    await test.step("2. Complete Type & Location and Details", async () => {
      await fillTypeAndLocation(page);
      await clickNext(page);
      await fillDetails(page);
      await clickContinueToPhotos(page);
    });

    await test.step("3. Submit Finalize with mandatory fields empty", async () => {
      await clickReviewListing(page);
    });

    await test.step("4. Show Finalize validation errors", async () => {
      // await expect(
      //   page.getByText("Name is required", { exact: true }).first(),
      // ).toBeVisible();
      await expect(
        page
          .getByText("Please upload at least 3 images to continue (0/3)", {
            exact: true,
          })
          .first(),
      ).toBeVisible();
    });
  });

  // CPLK_M3_TC_08: Complete all mandatory listing fields with valid data (Finalize)
  test("CPLK_M3_TC_08: Complete all mandatory listing fields with valid data(Finalize)", async ({
    page,
  }) => {
    await test.step("1. Access new property page", async () => {
      await openListingWizard(page);
    });

    await test.step("2. Complete Type & Location and Details", async () => {
      await fillTypeAndLocation(page);
      await clickNext(page);
      await fillDetails(page);
      await clickContinueToPhotos(page);
    });

    await test.step("3. Complete mandatory Finalize fields", async () => {
      await finalizeContactAndImages(page);
      await clickReviewListing(page);
    });

    await test.step("4. Open the Review step", async () => {
      await expect(page.getByText(/property code/i)).toBeVisible();
    });
  });

  // CPLK_M3_TC_09: Verify all entered data on Review
  test("CPLK_M3_TC_09: Verify all entered data on Review", async ({ page }) => {
    await test.step("1. Access new property page", async () => {
      await openListingWizard(page);
    });

    await test.step("2. Complete Type & Location and Details", async () => {
      await fillTypeAndLocation(page);
      await clickNext(page);
      await fillDetails(page);
      await clickContinueToPhotos(page);
    });

    await test.step("3. Complete Finalize and open Review", async () => {
      await finalizeContactAndImages(page);
      await clickReviewListing(page);
    });

    await test.step("4. Verify all entered data", async () => {
      await review(page);
    });
  });

  // CPLK_M3_TC_10: Create a property listing and reach the payment step
  test("CPLK_M3_TC_10: Create a property listing and reach the payment step", async ({
    page,
  }) => {
    await test.step("step 1 - Open the listing wizard", async () => {
      await openListingWizard(page);
    });

    await test.step("Step 2 — Type & Location", async () => {
      await fillTypeAndLocation(page);
      await clickNext(page);
    });

    await test.step("Step 3 — Details (size, price, title, description)", async () => {
      await fillDetails(page);
      await clickContinueToPhotos(page);
    });

    await test.step("Step 4 — Finalize (add contact + upload 3 images)", async () => {
      await finalizeContactAndImages(page);
      await clickReviewListing(page);
    });

    await test.step("Step 5 — Review: verify all data + proceed to payment", async () => {
      await review(page);
      await proceedToPayment(page);
      await expect(page.getByText(/payment/i).first()).toBeVisible();
    });
  });
});
