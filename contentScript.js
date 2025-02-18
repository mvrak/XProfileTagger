let keysArray;
let urlMap;

(async () => {
    try {
        // Fetch from external URL instead of local file
        const response = await fetch('https://list.usaids.net', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        urlMap = await response.json();
        keysArray = Object.keys(urlMap);
        console.log(urlMap);
        main();
    } catch (error) {
        console.error('Error loading JSON from list.usaids.net:', error);
    }
})();

function main() {
    const observer = new MutationObserver(e => {
        e.forEach(e => {
            if ("childList" === e.type) {
                e.addedNodes.forEach(e => {
                    if (e.nodeType === Node.ELEMENT_NODE) {
                        e.querySelectorAll('[data-testid="User-Name"]').forEach(e => {
                            processUserName(e)
                        })
                    }
                })
            }
        })
    });

    function processUserName(e) {
        username = e.children[1].firstChild.firstChild.firstChild.firstChild.firstChild.textContent;
        console.log(username);
        if (shouldAddIcon(username, keysArray) && !e.hasAttribute("usaidsprocessed")) {
            iconnode = e.firstChild.firstChild.firstChild.firstChild.children[1];
            usaidsnode = iconnode.firstChild.cloneNode();
            usaidsnode.appendChild(document.createElement("img"));
            usaidsnode.firstChild.src = chrome.runtime.getURL("usaids.png");
            usaidsnode.firstChild.style = "max-width:20px;max-height:20px;";
            iconnode.appendChild(usaidsnode);
            refnode = e.children[1].firstChild.children[2].cloneNode(!0);
            refnode.firstChild.href = getCustomURL(username, urlMap);
            refnode.firstChild.target = "_blank";
            refnode.firstChild.firstChild.remove();
            refnode.firstChild.textContent = "US Aids Reference";
            refnode.firstChild.style.marginLeft = "8px";
            refnode.firstChild.setAttribute("aria-label", "US Aids Reference Link");
            e.children[1].firstChild.children[2].appendChild(refnode);
            e.setAttribute("usaidsprocessed", "true");
        }
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function shouldAddIcon(userName, keysArray) {
    return keysArray.includes(userName);
}

function getCustomURL(userName, urlMap) {
    return urlMap[userName] || "#";
}