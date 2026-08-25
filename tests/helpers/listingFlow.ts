import { Page, expect } from "@playwright/test";
import { openSite } from "./signup";

export const TEST_GOOGLE_EMAIL = "asangikanethmini25@gmail.com"; 

export const LISTING = {
  listingType: "For Rent",
  propertyType: "Restaurant",
  district: "Colombo",
  city: "Moratuwa",
  floorArea: "800",
  price: "100000",
  title: "QA Test Restaurant in Moratuwa " + Date.now(),
  description:
    "Automated QA test listing — please ignore. Spacious restaurant with parking and 24/7 security.",
  contactName: "QA Tester",
};

export const IMAGES = [
  "test-data/property-4.jpeg",
  "test-data/property-5.jpeg",
  "test-data/property-6.jpeg",
];

//Open Google SSO Page
export async function openSSOPage(page: Page) {
  const googleBtn = page
    .getByText("Google", { exact: true })
    .or(page.getByRole("link", { name: /google/i }));

  const account = page.getByText(TEST_GOOGLE_EMAIL);
  await expect(async () => {
    if (
      await googleBtn
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await googleBtn.first().click();
    }
    await expect(account).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 45000 });
}

//Choose Google Account
export async function chooseAccount(page: Page) {
  const account = page.getByText(TEST_GOOGLE_EMAIL);
  await account.click();
}

//Open new property page
export async function openNewPropertyPage(page: Page) {
  const wizard = page.getByText(/what are you listing/i);
  if (await wizard.isVisible({ timeout: 5000 }).catch(() => false)) return;
  await expect(wizard).toBeVisible({ timeout: 30000 });
}

//Click on List your property
export async function clickListYourProperty(page: Page) {
  await page.getByRole("button", { name: "list your property" }).click();
}

//Access new property page
export async function openListingWizard(page: Page) {
      await openSite(page);
       await clickListYourProperty(page);
       await openSSOPage(page);
       await chooseAccount(page);
       await openNewPropertyPage(page);
}

//Radix dropdown: open by its current label, then pick the option.
export async function chooseDropdown(
  page: Page,
  currentLabel: string,
  optionText: string,
) {
  await page.getByText(currentLabel, { exact: true }).click();
  const option = page.getByRole("option", { name: optionText });
  await option.scrollIntoViewIfNeeded();
  await option.click();
}

export async function clickNext(page: Page) {
  await page.getByRole("button", { name: /continue to details/i }).click();
}

//Step 1 — Type & Location.
export async function fillTypeAndLocation(page: Page) {
  await page.getByRole("button", { name: LISTING.listingType }).click();
  await page.getByRole("button", { name: LISTING.propertyType }).click();
  await chooseDropdown(page, "Select district", LISTING.district);
  await chooseDropdown(page, "Select city/suburb", LISTING.city);  
}

export async function clickContinueToPhotos(page: Page) {
  await page.getByRole("button", { name: /continue to photos/i }).click();
}

export async function clickReviewListing(page: Page) {
  await page.getByRole("button", { name: /review listing/i }).click();
}

export async function proceedToPayment(page: Page) {
  await page.getByRole("button", { name: /proceed to payment/i }).click();
}

//Step 2 — Details (size, price, title, description). 
export async function fillDetails(page: Page) {
  await page
    .getByRole("textbox", { name: "Floor Area" })
    .fill(LISTING.floorArea);
  await page.getByRole("textbox", { name: "Price" }).fill(LISTING.price);
  await page.getByRole("textbox", { name: /title/i }).fill(LISTING.title);
  await page
    .getByRole("textbox", { name: /description/i })
    .fill(LISTING.description);
}



//Step 3 — Add contact (only if none) + upload 3 images.
export async function finalizeContactAndImages(page: Page) {
  const nameField = page
    .getByRole("textbox", { name: "Name", exact: true })
    .or(page.getByPlaceholder("Contact name"));

  // Fill the mandatory Name ONLY if it's empty; leave an existing value alone.
  const fillNameIfEmpty = async () => {
    const current = (await nameField.inputValue().catch(() => "")).trim();
    if (!current) await nameField.fill(LISTING.contactName);
  };

  // Branch: this banner shows only when NO contact exists yet.
  const needNewContact = await page
    .getByText(
      /You haven't added any contacts yet\. Use "Add New Contact" in the phone dropdown to add one quickly, or add contacts from the Contacts page first\./i,
    )
    .isVisible({ timeout: 4000 })
    .catch(() => false);

  if (needNewContact) {
    // No contact yet: create one via the phone dropdown → modal.
    await page
      .getByRole("combobox", { name: /phone/i })
      .or(page.getByRole("button", { name: /phone/i }))
      .or(page.locator("button:has(svg)").last())
      .click();
    await page
      .getByText(/add new contact/i)
      .first()
      .click();

    const modal = page.getByRole("dialog");
    await modal
      .getByPlaceholder(/ashan perera|contact name/i)
      .fill(LISTING.contactName);
    await modal.getByPlaceholder(/771234567|phone/i).fill("771234567");
    await modal
      .getByRole("button", { name: /save & select|save and select|save/i })
      .click();
  }

  // Both paths: ensure the mandatory Name is filled (only if empty).
  await fillNameIfEmpty();

  // Upload the 3 required property images.
  await page.locator('input[type="file"]').first().setInputFiles(IMAGES);
  await expect(
    page.getByText(/3\s*\/\s*3|3 images ready|min 3/i),
  ).toBeVisible();

}

//verify ALL entered data on Review, then proceed to Payment.
export async function review(page: Page) {
  
  await expect(page.getByText(/property code/i)).toBeVisible();

  await expect(
    page.getByText(LISTING.listingType, { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText(LISTING.propertyType, { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText(LISTING.district, { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText(LISTING.city, { exact: true }).first(),
  ).toBeVisible();

  await expect(
    page.getByText(new RegExp(LISTING.floorArea + "\\s*Sq\\.?Ft", "i")).first(),
  ).toBeVisible();

  const grouped = Number(LISTING.price).toLocaleString("en-US"); // "100,000"
  await expect(page.getByText(new RegExp(grouped)).first()).toBeVisible();
  await expect(page.getByText(/LKR/).first()).toBeVisible();

  await expect(page.getByText(LISTING.title, { exact: true })).toBeVisible();
  await expect(
    page.getByText(LISTING.description, { exact: true }),
  ).toBeVisible();
  await expect(page.getByText(LISTING.contactName).first()).toBeVisible();

  const boxes = page.getByRole("checkbox");
  const count = await boxes.count();
  for (let i = 0; i < count; i++) await boxes.nth(i).check();
}
