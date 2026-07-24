# RELX QA Technical Assessment

This repository contains automated **Web UI** and **API** tests developed for the **RELX QA Technical Assessment**.

The project demonstrates automated testing using **WebdriverIO**, **Node.js**, **JavaScript**, **Mocha**, **Chai**, and **Axios**.

---

# Technologies Used

- WebdriverIO
- Node.js
- JavaScript
- Mocha
- Chai
- Axios

---

# Project Structure

```text
.
├── test
│   ├── pageobjects
│   │   ├── home.page.js
│   │   └── searchResults.page.js
│   └── specs
│       ├── api
│       │   ├── booking.create.api.js
│       │   ├── booking.update.api.js
│       │   ├── booking.get.api.js
│       │   └── booking.delete.api.js
│       └── web
│           └── test.e2e.js
├── package.json
├── package-lock.json
├── wdio.conf.js
└── README.md
```

---

# Test Coverage

## Web Automation

### Homepage

- Verify Cheapflights logo is displayed
- Verify Login button is displayed
- Verify logo is positioned to the left of the Login button
- Verify logo and Login button are vertically aligned

### Flight Search

#### Positive Tests

- Search for a valid round-trip flight

#### Negative Tests

- Search without origin
- Search without destination
- Search without departure date
- Submit an empty search form

#### Flight Search Assertions

- Verify navigation to the flight search results page
- Verify search results are displayed
- Verify returned flights contain the expected origin airport (MNL)
- Verify returned flights contain the expected destination airport (MPH)

---

## API Automation

### Create Booking

#### Positive Tests

- Create booking successfully

#### Negative Tests

- Missing required field
- Missing total price
- Invalid data type

#### Assertions

- HTTP status code
- Response body
- Response fields
- Response data types
- Response values

---

### Update Booking

#### Positive Tests

- Update booking successfully

#### Negative Tests

- Missing required field
- Invalid data type
- Invalid authentication token
- Update non-existent booking

#### Assertions

- HTTP status code
- Response body
- Response fields
- Response data types
- Updated values

---

### Get Booking

#### Positive Tests

- Retrieve booking by ID

#### Negative Tests

- Retrieve non-existent booking

#### Assertions

- HTTP status code
- Response body
- Response fields
- Response data types
- Response values

---

### Delete Booking

#### Positive Tests

- Delete booking successfully

#### Negative Tests

- Invalid authentication token
- Delete already deleted booking

#### Assertions

- HTTP status code
- Verify deleted booking returns HTTP 404 when retrieved

---

# Installation

Clone the repository.

```bash
git clone https://github.com/thejdsoto/relx-qa-technical-exam.git
```

Navigate to the project directory.

```bash
cd relx-qa-technical-exam
```

Install dependencies.

```bash
npm install
```

---

# Running the Tests

## Run all tests

```bash
npx wdio run wdio.conf.js
```

## Run Web UI tests

```bash
npx wdio run wdio.conf.js --spec ./test/specs/web/test.e2e.js
```

## Run Create Booking API tests

```bash
npx wdio run wdio.conf.js --spec ./test/specs/api/booking.create.api.js
```

## Run Update Booking API tests

```bash
npx wdio run wdio.conf.js --spec ./test/specs/api/booking.update.api.js
```

## Run Get Booking API tests

```bash
npx wdio run wdio.conf.js --spec ./test/specs/api/booking.get.api.js
```

## Run Delete Booking API tests

```bash
npx wdio run wdio.conf.js --spec ./test/specs/api/booking.delete.api.js
```

---

# Notes

- The UI automation follows the **Page Object Model (POM)** design pattern.
- API automation uses **Axios** for HTTP requests and **Chai** for assertions.
- UI tests include synchronization using explicit waits.
- Search result tests handle the application's intermittent multiple-tab behavior.
- Negative API tests document the current behavior of the public Restful Booker API, including scenarios where the API returns unexpected responses.

---

# Author

**John David Soto**

GitHub: https://github.com/thejdsoto