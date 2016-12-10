self.addEventListener('install', function(event) {
    console.log('INSTALLED');
});

console.log('ADDING FETCH at root level');
self.addEventListener('fetch', function(event) {
    //console.log('fetching ->', event.request);
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
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