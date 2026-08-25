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




