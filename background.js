console.log('Starting up background.js');
var count = 0;
var active = 0;
var maxActive = 2;
var queue = [];

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(request, sender, sendResponse) {
  console.log('got a msg!');

  if (request.msg == 'init') {
    chrome.pageAction.show(sender.tab.id);
  }

  if (request.msg == 'download') {
    console.log("queuing: " + request.url);
    queue.push(request.url);
    if (active < maxActive) {
      processQueue();
    }
  }

  sendResponse({});
}

function processQueue() {
  var url = queue.shift();
  if (url) {
    startDownload(url);
  }
}

function startDownload(url) {
  console.log('Starting to download ' + url);
  chrome.experimental.downloads.download({
    saveAs: false,
    url: url,
  }, function(downloadId) {
    if (downloadId) {
      active += 1;
      console.log('download id:  ' + downloadId);
    } else {
      console.log('failed to initiate download.');
      processQueue();
    }
  });
}

function setTitle() {
  //chrome.pageAction.setTitle()
}

chrome.experimental.downloads.onChanged.addListener(function(info) {
  if (info.state && info.state.old && info.state.new) {
    if (info.state.new != 'in_progress' && info.state.old == 'in_progress') {
      console.log('Finished downloading ' + info.filename.new);
      active -= 1;
      if (active < maxActive) {
        processQueue();
      }
    }
  }
});

chrome.extension.onRequest.addListener(onRequest);

chrome.pageAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, {count: count}, function(response) {
    console.log(response.msg);
  });
  count += 1;
});


