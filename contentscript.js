/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */

var isGoogleImageSearch = /Google Search/;
var regex = /imgurl=(https?:\/\/[^&]+)&amp;/g;

// Test the text of the body element against our regular expression.

/*
console.log('starting timer');

$.doTimeout( 5000, function(){
  console.log('Checking page contents');
  console.log('Contents: ' + document.body.innerHTML);
  while (match = regex.exec(document.body.innerHTML)) {
    console.log("found url: " + match[1]);
  }
});
*/

console.log('Testing page contents');
if (isGoogleImageSearch.test(document.title)) {
  console.log('Match! firing event');
  chrome.extension.sendRequest({ msg: 'init' }, function(response) {});
}


chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Got click #' + request.count);
  console.log('starting to download photos');
  while (match = regex.exec(document.body.innerHTML)) {
    console.log("found url: " + match[1]);
    chrome.extension.sendRequest({
      msg: 'download',
      url: match[1]
    }, function(response) {});
  }  
    
  sendResponse({msg: "goodbye"});
});

