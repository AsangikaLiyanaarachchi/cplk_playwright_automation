# CPLK Playwright Automation

Playwright automation for the CPLK property-owner journey, property listing, and payment submission test cases.

## Installation

### 1. Install dependencies

Open the project folder in VS Code and run:

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

## Running the Tests

### 1. Capture Google Authentication

Run the authentication setup:

```bash
npx playwright test tests/auth.setup.ts --project=auth-setup --headed
```

Sign in to the Google test account manually. The authenticated session will be saved to:

```text
auth/user.json
```

---

### 2. Property Owner Signup Test

Run all Property Owner Signup tests:

```bash
npx playwright test tests/signup.spec.ts --project=journey --headed
```

Run a specific test case:

```bash
npx playwright test tests/signup.spec.ts --project=journey --headed -g "CPLK_M1_TC_<test case number>"
```

Example:

```bash
npx playwright test tests/signup.spec.ts --project=journey --headed -g "CPLK_M1_TC_01"
```

---

### 3. Create a Property Listing Test

Run all Property Listing tests:

```bash
npx playwright test tests/create-listing.spec.ts --project=journey --headed
```

Run a specific test case:

```bash
npx playwright test tests/create-listing.spec.ts --project=journey --headed -g "CPLK_M3_TC_<test case number>"
```

Example:

```bash
npx playwright test tests/create-listing.spec.ts --project=journey --headed -g "CPLK_M3_TC_10"
```

---

### 4. Payment Test

Run all Payment tests:

```bash
npx playwright test tests/payment.spec.ts --project=journey --headed
```

Run a specific test case:

```bash
npx playwright test tests/payment.spec.ts --project=journey --headed -g "CPLK_M4_TC_<test case number>"
```

Example:

```bash
npx playwright test tests/payment.spec.ts --project=journey --headed -g "CPLK_M4_TC_07"
```

---

### 5. Run All Tests

```bash
npx playwright test
```

### 6. Run Tests in Headed Mode

To see the browser while the tests are running:

```bash
npx playwright test --headed
```

### 7. View the HTML Report

```bash
npx playwright show-report
```

# Bugs / Issues Identified

## BUG-01 — Mandatory Listing Fields Are Not Validated When Resuming a Draft

**Severity:** High

**Title:** Mandatory listing fields (Floor Area, Price, Title, Description) are not validated when resuming a draft listing at the Review step.

### Description

When a partially completed property listing is saved as a draft and later resumed from **All Properties**, the listing can skip the **Details** and **Finalize** steps and resume directly at the **Review** step.

At the Review step, only the Property Images validation is performed. Mandatory fields such as **Floor Area, Price, Title, and Description** are not validated before proceeding to payment.

### Steps to Reproduce

1. Start creating a new property listing.
2. Fill in only the **Type & Location** step, then leave/exit the flow.

   * The partial listing is automatically saved and appears under **All Properties**.
3. Open the saved listing again from **All Properties**.

   * The listing resumes directly at the **Review** step, skipping **Details** and **Finalize**.
4. Click **Proceed to Payment**.

   * The action is blocked with an **"images required"** error only.
5. Upload the minimum 3 required images.
6. Click **Proceed to Payment** again.

   * The listing successfully proceeds to the **Payment Method** step.

### Expected Result

The mandatory fields **Floor Area, Price, Title, and Description** should remain validated when a draft listing is resumed.

The **Proceed to Payment** action should be blocked until all mandatory fields across every listing step have been completed, regardless of whether the user:

* Completes the listing through the normal wizard flow, or
* Resumes a previously saved draft.

### Actual Result

Only the **Property Images** requirement is validated at the Review step.

The following mandatory fields can remain empty:

* Floor Area
* Price
* Title
* Description

After the minimum required images are uploaded, the listing is allowed to proceed to the Payment Method step despite these mandatory fields being incomplete.

### Impact

An incomplete property listing can reach the payment stage without essential property information such as size, price, title, and description.

This could potentially result in:

* Invalid or incomplete listings being paid for.
* Incomplete properties being published.
* Refund or payment-related support issues.
* Poor user experience for property owners.








