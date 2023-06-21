// content.js

// Function to extract the domain from a URL
function getDomainFromUrl(url) {
    const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
    const matches = url.match(domainRegex);
    return matches && matches[1];
  }
  
  // Get the current tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    const url = currentTab.url;
    
    // Extract the domain from the URL
    const domain = getDomainFromUrl(url);
    
    // Send a message to the background script with the domain
    chrome.runtime.sendMessage({ domain });
  });
  