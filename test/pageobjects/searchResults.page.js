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
        }
    }
}
module.exports = new SearchResultsPage();