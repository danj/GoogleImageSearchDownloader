console.log('Starting up background.js');
var count = 0;

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(request, sender, sendResponse) {
  console.log('got a msg!');

  if (request.msg == 'init') {
    chrome.pageAction.show(sender.tab.id);
  }

  if (request.msg == 'download') {
    console.log("downloading : " + request.url);
    chrome.experimental.downloads.download({
      saveAs: false,
      url: request.url,
    }, function(downloadId) {
      console.log('downloaded ' + downloadId);
    });
  }

  sendResponse({});
}

chrome.extension.onRequest.addListener(onRequest);

chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, {count: count}, function(response) {
    console.log(response.msg);
  });
  count += 1;
});


