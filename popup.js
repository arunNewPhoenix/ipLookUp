// Function to update the domainIPMap
function updateDomainIPMap(domainIPMap, domain, ipAddress) {
  if (domainIPMap.hasOwnProperty(domain)) {
    // Domain already exists in the map
    const domainData = domainIPMap[domain];

    if (domainData.ipAddresses.includes(ipAddress)) {
      // IP address already exists for the domain
      return true;
    } else {
      // New IP address encountered for the domain
      domainData.ipAddresses.push(ipAddress);
      domainData.count++;
      return false;
    }
  } else {
    // New domain encountered
    domainIPMap[domain] = {
      ipAddresses: [ipAddress],
      count: 1,
    };
    return false;
  }
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const currentTab = tabs[0];
  const url = currentTab.url;

  function getDomainFromUrl(url) {
    const domainRegex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;
    const matches = url.match(domainRegex);
    return matches && matches[1];
  }

  const domain = getDomainFromUrl(url);

  const apiUrl = "https://api.api-ninjas.com/v1/dnslookup?domain=" + domain;
  console.log(apiUrl);
  const newApiKey = "YOUR_API_KEY";

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "X-Api-Key": newApiKey,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("DNS lookup failed: " + response.status);
      }
      return response.json();
    })
    .then((result) => {
      // const ipadd = document.getElementsByClassName('ipaddress')[0];
      // ipadd.innerHTML = result[0].value;

      // Update domainIPMap
      chrome.storage.local.get("domainIPMap", function (data) {
        const storedDomainIPMap = data.domainIPMap || {};
        const domainName = document.getElementsByClassName("domainName")[0];

        domainName.innerHTML = domain;

        console.log(domain);

        confidence = updateDomainIPMap(
          storedDomainIPMap,
          domain,
          result[0].value
        );

        const score = document.getElementsByClassName("score")[0];
        if (confidence) {
          score.innerHTML = "HIGH";
        } else {
          score.innerHTML = "LOW";
        }

        // Get the .score element
        const scoreElement = document.querySelector(".confidenceIndicator");

        // Check the confidence value and update the CSS class
        if (confidence) {
          scoreElement.innerHTML = '<div class="wrapper"><svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg></div>';
        } else {
          scoreElement.innerHTML = '<div class="crossWrapper"><svg class="checkmarkCross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark_circleCross" cx="26" cy="26" r="25" fill="none"/><path class="checkmark_checkCross" fill="none" d="M14.1 14.1l23.8 23.8 m0,-23.8 l-23.8,23.8"/></svg></div>';
        }

        chrome.storage.local.set({ domainIPMap: storedDomainIPMap });
        console.log(storedDomainIPMap);
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
