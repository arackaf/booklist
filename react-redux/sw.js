self.addEventListener('install', function(event) {
    console.log('hello');
    try {
        console.log('typeof System in install', typeof System);
    } catch(e){}

    console.log('not caching');

    console.log('ADDING FETCH in install');
    self.addEventListener('fetch', function(event) {
        console.log('fetching ->', event.request);
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
    })

    // console.log('caching');
    // event.waitUntil(
    //     caches.open('v1').then(function(cache) {
    //         console.log('caching - getting');
    //         return cache.addAll([
    //             '/react-redux/a.js'
    //         ]);
    //     }).catch(function(error){ console.log('error', error) })
    // );
});

// this.addEventListener('activate', function(event) {
//     console.log('activate');
// });