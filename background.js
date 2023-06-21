// Initialize domainIPMap with existing data from storage (if any)
let domainIPMap = {};

// Retrieve domainIPMap from storage
chrome.storage.local.get('domainIPMap', function (data) {
  if (data.domainIPMap) {
    domainIPMap = data.domainIPMap;
  }
});

// Message listener to update domainIPMap and respond with updated value
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'updateDomainIPMap') {
    const domain = request.domain;
    const ipAddress = request.ipAddress;

    if (domain in domainIPMap) {
      const domainData = domainIPMap[domain];

      if (!domainData.ipAddresses.includes(ipAddress)) {
        domainData.ipAddresses.push(ipAddress);
        domainData.count++;
      }
    } else {
      domainIPMap[domain] = {
        ipAddresses: [ipAddress],
        count: 1
      };
    }

    // Save updated domainIPMap to storage
    chrome.storage.local.set({ 'domainIPMap': domainIPMap }, function () {
      // Send back the updated domainIPMap
      sendResponse(domainIPMap);
    });

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
