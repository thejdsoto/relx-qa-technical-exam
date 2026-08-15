const Page = require('./page');

class SearchResultsPage extends Page {

    get resultCards() {
        return $$('[role="group"][aria-label^="Result item"]');
    }

    async switchToResultsWindow() {
        await browser.pause(2000);

        const handles = await browser.getWindowHandles();

        if (handles.length > 1) {
            await browser.switchToWindow(handles[handles.length - 1]);
            // Wait for result cards to appear in the switched window
            await browser.waitUntil(async () => {
                const cards = await this.resultCards;
                return cards.length > 0;
            }, {
                timeout: 10000,
                timeoutMsg: 'No result cards appeared after switching to results window'
            });
        }
    }
}
module.exports = new SearchResultsPage();