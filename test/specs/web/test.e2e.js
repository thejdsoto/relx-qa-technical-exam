const { expect } = require('@wdio/globals');
const HomePage = require('../../pageobjects/home.page');
const SearchResultsPage = require('../../pageobjects/searchResults.page');

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
        await HomePage.setOrigin('Manila');
        await HomePage.setDestination('Boracay');
        await HomePage.setDepartureDate();
        await HomePage.setReturnDate();
        await HomePage.setPassengers(2, 1, 0, 'Economy'); // 2 adults, 1 child, 0 infants
        await HomePage.search();
        console.log(await browser.getUrl());
        console.log(await browser.getWindowHandles());

        // Assert if search result page is navigated correctly  
        const url = await browser.getUrl();
        await SearchResultsPage.switchToResultsWindow();
        await expect(browser).toHaveUrl(
            expect.stringContaining('/flight-search/')
        );

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
        const firstCard = SearchResultsPage.resultCards[0];
        const text = await firstCard.getText();

        await expect(firstCard).toHaveText(
            expect.stringContaining('MNL')
        );

        await expect(firstCard).toHaveText(
            expect.stringContaining('MPH')
        );
    });

    it('search without origin', async () => {
        await HomePage.clearOrigin();
        await HomePage.setDestination('Boracay');
        await HomePage.setDepartureDate();
        await HomePage.setReturnDate();
        await HomePage.setPassengers(2, 1, 0, 'Economy'); // 2 adults, 1 child, 0 infants
        await HomePage.search();
        const texts = await HomePage.validationMessages;

        // Error message
        expect(texts).toHaveText(
            expect.stringContaining("Please enter a 'From' airport.")
        );
    });

    it('search without destination', async () => {
        await HomePage.clearOrigin();
        await HomePage.setOrigin('Manila');
        await HomePage.setDepartureDate();
        await HomePage.setReturnDate();
        await HomePage.setPassengers(2, 1, 0, 'Economy'); // 2 adults, 1 child, 0 infants
        await HomePage.search();
        const texts = await HomePage.validationMessages;

        // Error message
        expect(texts).toHaveText(
            expect.stringContaining("Please enter a 'To' airport.")
        );
    });

    it('search without departure date', async () => {
        await HomePage.clearOrigin();
        await HomePage.setOrigin('Manila');
        await HomePage.setDestination('Boracay');
        await HomePage.setReturnDate();
        await HomePage.setPassengers(2, 1, 0, 'Economy'); // 2 adults, 1 child, 0 infants
        await HomePage.search();
        const texts = await HomePage.validationMessages;

      // Error message
        expect(texts).toHaveText(
            expect.stringContaining("Please enter a valid 'Depart' date.")
        );

    });

    it('submit empty search', async () => {
        await HomePage.search();
        const texts = await HomePage.validationMessages;

        // No origin error message
        expect(texts).toHaveText(
            expect.stringContaining("Please enter a 'From' airport.")
        );

        // No destination error message
        expect(texts).toHaveText(
            expect.stringContaining("Please enter a 'To' airport.")
        );

        // No departure date error message
        expect(texts).toHaveText(
            expect.stringContaining("Please enter a valid 'Depart' date.")
        );

        // No returen date error message
        expect(texts).toHaveText(
            expect.stringContaining("Please enter a valid 'Return' date. If you wish to search for a one-way flight, please click the 'One-way' button above.")
        );
    });

});
