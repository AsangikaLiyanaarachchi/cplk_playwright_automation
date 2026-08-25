import { Page, expect } from "@playwright/test";
import {
  clickContinueToPhotos,
  clickNext,
  clickReviewListing,
  fillDetails,
  fillTypeAndLocation,
  finalizeContactAndImages,
  openListingWizard,
  proceedToPayment,
  review,
} from "./listingFlow";

export const PAYMENT_SLIP = "test-data/payment-slip.jpeg";

export const TEST_CARD = {
  name: "QA Tester",
  number: "4916217501611292", // PayHere sandbox Visa
  cvv: "123",
  expiry: "12/26",
  phone: "0771234567",
};

//Create a valid property listing and finish on the Payment step.
export async function createPropertyListing(page: Page) {
  await openListingWizard(page);
  await fillTypeAndLocation(page);
  await clickNext(page);
  await fillDetails(page);
  await clickContinueToPhotos(page);
  await finalizeContactAndImages(page);
  await clickReviewListing(page);
  await review(page);
  await proceedToPayment(page);
  await expect(page.getByText(/payment/i).first()).toBeVisible();
}

//------------------------------Bank Transfer------------------------------

//Select Bank Transfer as the payment method.
export async function selectBankTransfer(page: Page) {
  await expect(
    page.getByText(/complete payment to publish|listing fee/i).first(),
  ).toBeVisible();
  await page.getByText("Bank Transfer", { exact: true }).click();
}

//Upload the required bank-transfer payment slip. 
export async function uploadPaymentSlip(page: Page) {
  await page.locator('input[type="file"]').first().setInputFiles(PAYMENT_SLIP);
  await expect(page.getByText(/remove/i).first()).toBeVisible();
}

//Confirm and submit the payment slip for review.
export async function submitPaymentSlip(page: Page) {
  const boxes = page.getByRole("checkbox");
  const count = await boxes.count();
  for (let i = 0; i < count; i++) await boxes.nth(i).check();

  await page
    .getByRole("button", { name: /submit payment slip & send for review/i })
    .click();
}

//Bank Transfer: upload the payment slip and submit for review.
export async function payByBankTransferAndSubmit(page: Page) {
  await selectBankTransfer(page);
  await uploadPaymentSlip(page);
  await submitPaymentSlip(page);
}

//Verify the listing reached the submitted / pending-approval state.
export async function expectPendingApproval(page: Page) {
  await expect(page.getByTestId("property-status-badge")).toHaveText(
    /payment verification/i,
    { timeout: 60000 },
  );
  await expect(
    page.getByText(/payment slip.*review|pending review/i).first(),
  ).toBeVisible();
}


//------------------------------Pay Online------------------------------

//Select Pay Online as the payment method.
export async function selectPayOnline(page: Page) {
  await page.getByText("Pay Online", { exact: true }).click();
}

//Fill the required phone number for the Pay Online payment form.
export async function fillPayOnlinePhone(page: Page) {
  await page
    .getByRole("textbox", { name: /phone|771234567/i })
    .or(page.getByPlaceholder("771234567"))
    .first()
    .fill(TEST_CARD.phone);
}

//Accept the payment terms and open the PayHere checkout.
export async function agreeAndOpenPayHere(page: Page): Promise<Page> {
  const boxes = page.getByRole("checkbox");
  for (let i = 0; i < (await boxes.count()); i++) await boxes.nth(i).check();

  const [maybePopup] = await Promise.all([
    page.waitForEvent("popup", { timeout: 5000 }).catch(() => null),
    page.getByRole("button", { name: /Pay LKR 500 with PayHere/i }).click(),
  ]);

  return maybePopup ?? page;
}

//Select Visa in the PayHere checkout.
export async function selectVisa(payHerePage: Page) {
  await payHerePage.getByRole("img", { name: /visa/i }).click();
}

//Fill the PayHere sandbox checkout with the test card data.
export async function fillPayHereSandboxCardDetails(payHerePage: Page) {
  const checkoutFrame = payHerePage.frameLocator(
    'iframe[src*="payhere" i], iframe[src*="sandbox" i], iframe',
  );

  await checkoutFrame
    .getByPlaceholder("Name on Card")
    .or(payHerePage.getByPlaceholder("Name on Card"))
    .fill(TEST_CARD.name);
  await checkoutFrame
    .getByPlaceholder("Credit Card Number")
    .or(payHerePage.getByPlaceholder("Credit Card Number"))
    .fill(TEST_CARD.number);
  await checkoutFrame
    .getByPlaceholder("CVV")
    .or(payHerePage.getByPlaceholder("CVV"))
    .fill(TEST_CARD.cvv);
  await checkoutFrame
    .getByPlaceholder("Expiry MM/YY")
    .or(payHerePage.getByPlaceholder("Expiry MM/YY"))
    .fill(TEST_CARD.expiry);
}

//Pay Online: fill the required phone number, select Visa, fill the card details, and submit.
export async function payOnlineWithCard(page: Page) {
  await selectPayOnline(page);

  await fillPayOnlinePhone(page);
  const gw = await agreeAndOpenPayHere(page);
  const gwLike = gw;

  await selectVisa(gw);

  await fillPayHereSandboxCardDetails(gwLike);

  const pf = gwLike.frameLocator(
    'iframe[src*="payhere" i], iframe[src*="sandbox" i], iframe',
  );
  await pf
    .getByRole("button", { name: /Submit/i })
    .or(gwLike.getByRole("button", { name: /Submit/i }))
    .click();
}

//Verify the listing reached the submitted / pending-approval state (online path). 
export async function expectPendingApprovalOnline(page: Page) {
  await expect(page.getByTestId("property-status-badge")).toHaveText(
    /pending approval/i,
    { timeout: 60000 },
  );

  await expect(
    page.getByText(/Submitted for review - waiting for the approver/i),
  ).toBeVisible();
}
