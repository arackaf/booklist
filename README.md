# booklist

A book collection web app hosted at http://mylibrary.io/

I made this as a way to learn and try out modern web development tools I'm interested in, and to track my own library. Progress is limited to whatever time I can find, which means parts of this may be incomplete at any given time. Currently you can scan in your books, which are looked up via the GoodReads API, or manually enter them if they're not found. Books can be searched decently, including tagging with hierarchical subjects; there's also some data crude visualizations (made with D3) and a way to find book recommendations based on similarity searches agains a set of books you select. Public (read-only) access to your library can also be opted into. Most recently I've started to enable offline functionality via IndexedDB and Service Worker.

---

I initially made this with the goal of creating iterations of the site with React, Angular, Aurelia, etc. So far I've felt no desire to leave React or stop iterating on the (single) React version. Nonetheless, it's designed so that all iterations will share the same data, data access, etc. The few controllers left are sniffed out and wired with my [easy-express-controllers
](https://www.npmjs.com/package/easy-express-controllers) library, though at this point most of the backend is implemented with GraphQL via my [mongo-graphql-starter
](https://www.npmjs.com/package/mongo-graphql-starter) and [micro-graphql-react
](https://www.npmjs.com/package/micro-graphql-react) projects. Data is stored in Mongo, and all book info is looked up with the GoodReads API, subject to an unfortunate one-request-per-second limit imposed by GoodReads.

The current React iteration uses TypeScript and vanilla Hooks, and is in the `react` directory.

Future iterations may potentially look at ... whatever is thriving whenever the React version is done, if it ever is...
