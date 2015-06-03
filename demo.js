/*eslint-env browser*/
/*eslint quotes: [2, "single"], strict: [2, "global"]*/

'use strict';

var URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=your_key&format=json&nojsoncallback=1&tags=penguins';

function createImg(url) {
  var img = document.createElement('img');
  img.setAttribute('src', url);
  return img;
}

function append(fragment) {
  return function(image) {
    fragment.appendChild(image);
  };
}

function buildUrl(photo) {
  var farmId = photo.farm;
  var serverId = photo.server;
  var photoId = photo.id;
  var secret = photo.secret;
  return 'https://farm' + farmId + '.staticflickr.com/' + serverId
    + '/' + photoId + '_' + secret + '_m.jpg';
}

function insertPhotos(json) {
  var photos = json.photos.photo;
  var fragment = document.createDocumentFragment();
  var appendToFragment = append(fragment);
  photos.map(buildUrl).map(createImg).forEach(appendToFragment);
  document.body.appendChild(fragment);
}

function xhrDemo() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    insertPhotos(JSON.parse(xhr.responseText));
  };
  xhr.open('GET', URL);
  xhr.send();
}

function fetchDemo() {
  fetch(URL).then(function(response) {
    return response.json();
  }).then(function(json) {
    insertPhotos(json);
  });
}


function fetchDemo2() {
  var req = new Request(URL, {method: 'GET', cache: 'reload'});
  fetch(req).then(function(response) {
    return response.json();
  }).then(function(json) {
    insertPhotos(json);
  });
}

function fetchDemo3() {
  var req = new Request(URL);
  var postReq = new Request(req, {method: 'POST'});
  fetch(postReq).then(function(response) {
    return response.json();
  }).then(function(json) {
    insertPhotos(json);
  });
}

function responseDemo() {
  var headers = new Headers({
    'Content-Type': 'application/json',
  'Cache-Control': 'max-age=3600'
  });
  
  var response = new Response(JSON.stringify({photos: {photo: []}}), {'status': 200, headers: headers});
  response.json().then(function(json) {
    insertPhotos(json);
  });
}

function streamingDemo() {
  var req = new Request(URL, {method: 'GET', cache: 'reload'});
  fetch(req).then(function(response) {
    var reader = response.body.getReader();
    return reader.read();
  }).then(function(result, done) {
    if (!done) {
      // do something with each chunk
    }
    
  });
}
