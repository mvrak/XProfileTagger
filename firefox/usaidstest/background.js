const runtime = typeof browser !== 'undefined' ? browser : chrome;

console.log('Background script loaded');

// Fetch data when the extension loads
async function fetchData() {
    try {
        const response = await fetch('https://list.usaids.net', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Listen for messages from content script
runtime.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'getData') {
        fetchData().then(data => {
            sendResponse({ data: data });
        });
        return true; // Indicates we'll respond asynchronously
    }
});