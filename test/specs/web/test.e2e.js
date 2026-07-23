const { expect } = require('@wdio/globals');
const HomePage = require('../../pageobjects/home.page');

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
    });

    it('search without origin', async () => {});
    it('search without destination', async () => {});
    it('search without departure date', async () => {});
    it('search without return date', async () => {});
    it('submit empty search form', async () => {});
    it('Verify search results contain expected flight information', async () => {});

});
