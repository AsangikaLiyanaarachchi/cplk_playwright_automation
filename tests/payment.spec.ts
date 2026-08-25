import { test, expect } from "@playwright/test";

import {
  expectPendingApproval,
  payOnlineWithCard,
  expectPendingApprovalOnline,
  createPropertyListing,
  selectBankTransfer,
  submitPaymentSlip,
  uploadPaymentSlip,
  agreeAndOpenPayHere,
  fillPayOnlinePhone,
  selectPayOnline,
  selectVisa,
} from "./helpers/payment";

test.describe("Payment & submit for approval", () => {
  //CPLK_M4_TC_01: Cannot submit Bank Transfer without uploading a payment slip
  test("CPLK_M4_TC_01: Cannot submit Bank Transfer without uploading a payment slip", async ({
    page,
  }) => {
    await test.step("Navigate to the Payment page", async () => {
      await createPropertyListing(page);
    });

    await test.step("Select Bank Transfer without uploading a slip", async () => {
      await selectBankTransfer(page);
    });

    await test.step("Verify payment-slip submission is unavailable", async () => {
      await expect(
        page.getByRole("button", {
          name: /submit payment slip & send for review/i,
        }),
      ).toBeDisabled();
    });
  });

  //CPLK_M4_TC_02: Upload Bank Transfer payment slip and submit for approval
  test("CPLK_M4_TC_02: Upload Bank Transfer payment slip and submit for approval", async ({
    page,
  }) => {
    await test.step("Create a listing and reach Payment", async () => {
      await createPropertyListing(page);
    });

    await test.step("Select Bank Transfer and upload the payment slip", async () => {
      await selectBankTransfer(page);
      await uploadPaymentSlip(page);
    });

    await test.step("Submit the payment slip for approval", async () => {
      await submitPaymentSlip(page);
    });

    await test.step("Verify pending Financial Officer approval", async () => {
      await expectPendingApproval(page);
    });
  });

  //CPLK_M4_TC_03: Pay Online without filling mandatory fields
  test("//CPLK_M4_TC_03: Pay Online without filling mandatory fields", async ({
    page,
  }) => {
    await test.step("Step 1: Navigate to the Payment page", async () => {
      await createPropertyListing(page);
    });

    await test.step("Step 2: Select Pay Online and submit without a phone number", async () => {
      await selectPayOnline(page);
      await agreeAndOpenPayHere(page);
    });

    await test.step("Step 3: Verify the phone-number validation message", async () => {
      await expect(
        page.getByText("Phone number is required", { exact: true }).first(),
      ).toBeVisible();
    });
  });

  //CPLK_M4_TC_04: Pay Online with filling mandatory fields
  test("CPLK_M4_TC_04: Pay Online with filling mandatory fields", async ({
    page,
  }) => {
    await test.step("Step 1: Navigate to the Payment page", async () => {
      await createPropertyListing(page);
    });

    await test.step("Step 2: Select Pay Online and submit", async () => {
      await selectPayOnline(page);
      fillPayOnlinePhone(page);
      await agreeAndOpenPayHere(page);
    });
  });

  // CPLK_M4_TC_05: Select Visa and leave PayHere card fields empty
  test("CPLK_M4_TC_05: Cannot pay with Visa when mandatory card fields are empty", async ({
    page,
  }) => {
    let payHerePage = page;

    await test.step("Step 1: Navigate to the Payment page", async () => {
      await createPropertyListing(page);
    });

    await test.step("Step 2: Open PayHere and select Visa", async () => {
      await selectPayOnline(page);
      await fillPayOnlinePhone(page);
      payHerePage = await agreeAndOpenPayHere(page);
      await selectVisa(payHerePage);
    });

    await test.step("Step 3: Verify card payment is disabled without mandatory data", async () => {
      const payButton = payHerePage
        .frameLocator(
          'iframe[src*="payhere" i], iframe[src*="sandbox" i], iframe',
        )
        .getByRole("button", { name: /submit/i })
        .or(payHerePage.getByRole("button", { name: /submit/i }));

      await expect(payButton).toBeDisabled();
    });
  });

  // CPLK_M4_TC_06: Pay Online with mandatory data and submit successfully
  test("CPLK_M4_TC_06: Pay Online with mandatory data and submit successfully", async ({
    page,
  }) => {
    await test.step("Step 1: Navigate to the Payment page", async () => {
      await createPropertyListing(page);
    });

    await test.step("Step 2: Fill the Pay Online and Visa card details, then submit", async () => {
      await payOnlineWithCard(page);
    });

    await test.step("Step 3: Verify payment confirmation", async () => {
      await expect(page.getByText(/payment confirmed/i)).toBeVisible({
        timeout: 60000,
      });
    });
  });

  // CPLK_M4_TC_07: Pay Online successfully and verify the listing status
  test("CPLK_M4_TC_07: Successfully pay online and verify the listing is pending approval", async ({
    page,
  }) => {
    await test.step("Step 1: Navigate to the Payment page", async () => {
      await createPropertyListing(page);
    });

    await test.step("Step 2: Complete the Pay Online payment with valid card details", async () => {
      await payOnlineWithCard(page);
      await expect(page.getByText(/payment confirmed/i)).toBeVisible({
        timeout: 60000,
      });
    });

    await test.step("Step 3: Verify payment confirmation and listing status", async () => {
      await page.getByRole("link", { name: /view my listing/i }).click();
      await expectPendingApprovalOnline(page);
    });
  });
});
