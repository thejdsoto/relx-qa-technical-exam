Tech Stack
-----------
- Node.js
- WebdriverIO
- Mocha
- Chai
- Axios

Project Structure
-----------------
test
 pageobjects
 specs
   api
   web

Running API tests
-----------------
npx wdio run wdio.conf.js --spec ./test/specs/api/booking.create.api.js

Running UI tests
----------------
npx wdio run wdio.conf.js --spec ./test/specs/web/test.e2e.js

Running all tests
-----------------
npx wdio run wdio.conf.js