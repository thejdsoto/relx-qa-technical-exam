const Page = require('./page');

class HomePage extends Page {
    get logo() {
        return $('[aria-label="Go to the cheapflights homepage"]');
    }

    get loginButton() {
        return $('[aria-label="Sign in"]');
    }

    get originInput() {
        return $('[aria-label="Origin location"]');
    }

    get destinationInput() {
        return $('[aria-label="Destination location"]');
    }

    get departureDate() {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 15); // Set the target date to 30 days from today

        const dateLabel = targetDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).replace(',', '');

        return dateLabel;
    }

    get returnDate() {
            const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30); // Set the target date to 30 days from today

        const dateLabel = targetDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).replace(',', '');

        return dateLabel;  
    }

    get decrementAdultsButton() {
        return $('//input[@aria-label="Adults"]/preceding-sibling::button[@aria-label="Decrement"]');
    }

    get incrementAdultsButton() {
        return $('//input[@aria-label="Adults"]/following-sibling::button[@aria-label="Increment"]');
    }

    get decrementChildrenButton() {
        return $('//input[@aria-label="Children"]/preceding-sibling::button[@aria-label="Decrement"]');
    }

    get incrementChildrenButton() {
        return $('//input[@aria-label="Children"]/following-sibling::button[@aria-label="Increment"]');
    }

    get decrementInfantsButton() {
        return $('//input[@aria-label="Infants"]/preceding-sibling::button[@aria-label="Decrement"]');
    }

    get incrementInfantsButton() {
        return $('//input[@aria-label="Infants"]/following-sibling::button[@aria-label="Increment"]');
    }

    get searchFlightButton() {
        return $('button[type="submit"][aria-label="Search"]');
    }

    get validationMessages() {
        return $$('li[role="alert"]');
    }

    async clearOrigin() {
        const flightOrigin = await $('[aria-label="Flight origin input"]');
        const removeBtn = await flightOrigin.$('[aria-label="Remove value"]');
        if (!removeBtn || !(await removeBtn.isExisting())) {
            return;
        }

        let displayed = false;
        try {
            displayed = await removeBtn.isDisplayed();
        } catch (err) {
            displayed = false;
        }

        if (!displayed) return;

        await removeBtn.waitForClickable({ timeout: 3000 });
        try {
            await removeBtn.click();
        } catch (err) {
            const msg = err && err.message ? err.message : '';
            if (/stale element reference/i.test(msg)) {
                const freshOrigin = await $('[aria-label="Flight origin input"]');
                const freshRemove = await freshOrigin.$('[aria-label="Remove value"]');
                if (await freshRemove.isExisting()) {
                    await freshRemove.waitForClickable({ timeout: 3000 });
                    await freshRemove.click();
                }
            } else {
                throw err;
            }
        }
    }

    async setOrigin(location) {
        await this.originInput.click();
        await this.originInput.setValue(location);

        // Wait until the autocomplete suggestions are displayed
        await browser.waitUntil(async () => {
            const input = await this.originInput;
            return (await input.getAttribute('aria-expanded')) === 'true';
        });

        // Wait until the autocomplete suggestions are populated
        await browser.waitUntil(async () => {
            const options = await $$('#flight-origin-smarty-input-list li');
            return options.length > 0;
        });

        await browser.keys('Enter');
    }

    async setDestination(location) {
        await this.destinationInput.click();
        await this.destinationInput.setValue(location);

        // Wait until the autocomplete suggestions are displayed
        await browser.waitUntil(async () => {
            const input = await this.destinationInput;
            return (await input.getAttribute('aria-expanded')) === 'true';
        });

        // Wait until the autocomplete suggestions are populated
        await browser.waitUntil(async () => {
            const options = await $$('#flight-destination-smarty-input-list li');
            return options.length > 0;
        });

        await browser.keys('Enter');
    }

    async setDepartureDate() {
        const departureDateInput = await $('[aria-label="Departure date"]');
        await departureDateInput.click();
        
        const departureData = await $(`[aria-label^="${this.departureDate}"]`);
        await departureData.click();
    }

    async setReturnDate() {
        const returnDateInput = await $('[aria-label="Return date"]');
        await returnDateInput.click();
        
        const returnData = await $(`[aria-label^="${this.returnDate}"]`);
        await returnData.click();    
    }

    async clearPassengers() {
        await this.decrementAdultsButton.click();  
    }

    async setPassengers(adults, children, infants, travelClass) {
        await this.clearPassengers();
        for (let i = 0; i < adults; i++) {
            await this.incrementAdultsButton.click();
        }

        for (let i = 0; i < children; i++) {
            await this.incrementChildrenButton.click();

            // Wait until the new age dropdown appears for the newly added child
            await browser.waitUntil(async () => {
                const dropdowns = await $$('[aria-label="Age Age"]');
                return dropdowns.length === i + 1;
            });

            // Open this child's age dropdown
            const dropdowns = await $$('[aria-label="Age Age"]');
            await dropdowns[i].click();

            // Random age between 0 and 17
            const age = Math.floor(Math.random() * 18);

            // Select the age
            const option = await $(`li[role="option"][aria-label="${age}"]`);
            await option.waitForClickable();
            await option.click();
        }

        for (let i = 0; i < infants; i++) {
            await this.incrementInfantsButton.click();
        }

        const travelClassInput = await $(`label[aria-label="${travelClass}"]`);
        await travelClassInput.click();
        await $('[aria-label="Trip type"]').click(); // Close the passengers dropdown
    }

    async search() {
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                await this.searchFlightButton.waitForClickable({ timeout: 5000 });
                await this.searchFlightButton.click();
                return;
            } catch (err) {
                const msg = err && err.message ? err.message : '';
                if (/stale element reference/i.test(msg) && attempt < maxAttempts) {
                    await browser.pause(500);
                    continue;
                }
                throw err;
            }
        }
    }

    open() {
        return super.open('');
    }
}

module.exports = new HomePage();