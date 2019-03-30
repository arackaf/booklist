# booklist

A fully functioning book collection website hosted at http://mylibrary.io/

I made this as a way to learn and try out modern development tools I'm interested in, and also to track my own library. Progress is limited to whatever time I can find, which means parts of this may be incomplete at any given time. Currently you can scan in your books, which are looked up via GoodReads API, or manually enter them if they're not found. Books can be searched decently, including tagging with hierarchical subjects; there's also some data crude visualizations (made with D3) and a way to find book recommendations based on similarity searches agains a set of books you select. Public (read-only) access to your library can also be opted into. Most recently I've started to enable offline functionality which is enabled via IndexedDB and Service Worker.

---

I initially made this with the goal of creating iterations of the site with React, Angular, Aurelia, etc. So far I've felt no desire to leave React or stop iterating on the (single) React version. Nonetheless, it's designed so that all iterations will share the same data, data access, controllers, and AWS access code. Most controllers are sniffed out and wired with my [easy-express-controllers
](https://www.npmjs.com/package/easy-express-controllers), though that's slowly but surely being converted to GraphQL with my [mongo-graphql-starter
](https://www.npmjs.com/package/mongo-graphql-starter) and [micro-graphql-react
](https://www.npmjs.com/package/micro-graphql-react) projects. Data access is through Mongo, and all book info is looked up with the GoodReads API, subject to an unfortunate one-request-per-second limit imposed by GoodReads.

The current React iteration uses vanilla Hooks, and is in the react-redux directory (unfortunately named, for now, from when it used Redux), with TypeScript.

Future iterations may potentially look at ... whatever is thriving whenever the React version is done, if it ever is...
