self.addEventListener('install', function(event) {
    console.log('INSTALLED');

    console.log('ADDING CACHE FILES');
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll([
                '/react-redux/node_modules/react/dist/react-with-addons.js',
                '/react-redux/node_modules/react-dom/dist/react-dom.js',
                '/react-redux/a.js'
            ]).then(function(){ console.log('cache filling success'); }).catch(function(){ console.log('cache filling failure') });
        })
    );
});

console.log('ADDING FETCH at root level');
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    console.log('cache hit', event.request);
                    return response;
                }
                return fetch(event.request);
            })
    );
});


self.addEventListener('activate', function(event) {
    console.log('ACTIVATE');
});

// this.addEventListener('activate', function(event) {
//     console.log('activate');
// });