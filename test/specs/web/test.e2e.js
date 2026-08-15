const { expect } = require('@wdio/globals');
const HomePage = require('../../pageobjects/home.page');
const SearchResultsPage = require('../../pageobjects/searchResults.page');
const { flightDetails, errorMessages } = require('../../data/web.flight.data');

describe('HomePage', () => {

    beforeEach(async () => {
        await HomePage.open();
    });

    it('should display the Cheapflights logo on the homepage', async () => {
        await expect(HomePage.logo).toBeDisplayed();
    });

    it('should display the Cheapflights login button on the homepage', async () => {
        await expect(HomePage.loginButton).toBeDisplayed();
    });

    it('should verify correct positioning of the logo and the login button', async () => {
        const logoLocation = await HomePage.logo.getLocation();
        const loginButtonLocation = await HomePage.loginButton.getLocation();

        expect(logoLocation.x).toBeLessThan(loginButtonLocation.x, 'Logo should be to the left of the login button');
        expect(Math.abs(loginButtonLocation.y - logoLocation.y)).toBeLessThan(20, 'Logo button should be vertically aligned with the login button');
    });
});

describe('Flight results', () => {

    beforeEach(async () => {
        // Clear cookies, local storage, and session before each test
        await browser.deleteCookies();
        await browser.execute(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        await HomePage.open();
    });

    it('should be able to search valid round-trip flights', async () => {
        await HomePage.clearOrigin();
        await HomePage.setOrigin(flightDetails.origin);
        await HomePage.setDestination(flightDetails.destination);
        await HomePage.setDepartureDate();
        await HomePage.setReturnDate();
        await HomePage.setPassengers(flightDetails.adult, flightDetails.child, flightDetails.infant, flightDetails.travelClass);
        await HomePage.search();

        // Assert if search result page is navigated correctly  
        await SearchResultsPage.switchToResultsWindow();
        await expect(browser).toHaveUrl(
            expect.stringContaining('/flight-search/')
        );

        // Wait for cards to be populated
        await browser.waitUntil(async () => {
            const cards = await SearchResultsPage.resultCards;
            return cards.length > 0;
            }, {
                timeout: 10000,
                timeoutMsg: 'Flight results did not load'
        });

        // Assert if results exist
        const cards = await SearchResultsPage.resultCards;
        expect(cards.length).toBeGreaterThan(0);

        // Assert that the expected airports are displayed
        const firstCard = cards[0];
        await firstCard.waitForDisplayed({ timeout: 5000 });
        const text = await firstCard.getText();

        await expect(firstCard).toHaveText(
            expect.stringContaining(flightDetails.originCode)
        );

        await expect(firstCard).toHaveText(
            expect.stringContaining(flightDetails.destinationCode)
        );
    });

    it('search without origin', async () => {
        await HomePage.clearOrigin();
        await HomePage.setDestination(flightDetails.destination);
        await HomePage.setDepartureDate();
        await HomePage.setReturnDate();
        await HomePage.setPassengers(flightDetails.adult, flightDetails.child, flightDetails.infant, flightDetails.travelClass);
        await HomePage.search();
        const texts = await HomePage.validationMessages;

        // Error message
        expect(texts).toHaveText(
            expect.stringContaining(errorMessages.origin)
        );
    });

    it('search without destination', async () => {
        await HomePage.clearOrigin();
        await HomePage.setOrigin(flightDetails.origin);
        await HomePage.setDepartureDate();
        await HomePage.setReturnDate();
        await HomePage.setPassengers(flightDetails.adult, flightDetails.child, flightDetails.infant, flightDetails.travelClass);
        await HomePage.search();
        const texts = await HomePage.validationMessages;

        // Error message
        expect(texts).toHaveText(
            expect.stringContaining(errorMessages.destination)
        );
    });

    it('search without departure date', async () => {
        await HomePage.clearOrigin();
        await HomePage.setOrigin(flightDetails.origin);
        await HomePage.setDestination(flightDetails.destination);
        await HomePage.setReturnDate();
        await HomePage.setPassengers(flightDetails.adult, flightDetails.child, flightDetails.infant, flightDetails.travelClass);
        await HomePage.search();
        const texts = await HomePage.validationMessages;

      // Error message
        expect(texts).toHaveText(
            expect.stringContaining(errorMessages.departureDate)
        );

    });

    it('submit empty search', async () => {
        await HomePage.search();
        const texts = await HomePage.validationMessages;

        // No origin error message
        expect(texts).toHaveText(
            expect.stringContaining(errorMessages.origin)
        );

        // No destination error message
        expect(texts).toHaveText(
            expect.stringContaining(errorMessages.destination)
        );

        // No departure date error message
        expect(texts).toHaveText(
            expect.stringContaining(errorMessages.departureDate)
        );

        // No return date error message
        expect(texts).toHaveText(
            expect.stringContaining(errorMessages.returnDate)
        );
    });

});
    