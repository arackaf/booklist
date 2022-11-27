# booklist

A web app to track your book collection, currently hosted at [https://mylibrary.io/](https://mylibrary.io/) (and [https://svelte.mylibrary.io](https://svelte.mylibrary.io))

I made this to help me learn and try modern web dev tools I'm interested in, and to track my own library. Progress is limited to whatever time I can find, so naturally pieces are always incomplete, or not well polished. Currently you can scan your books, which are looked up via the GoodReads API, or manually enter them. Books can be searched, tagged, and organized with hierarchical subjects. There's also some crude data visualizations (made with D3) and a way to find book recommendations based on similarity searches agains a set of books you select. Public (read-only) access to your library can also be opted into—mine here [here](https://mylibrary.io/view?userId=573d1b97120426ef0078aa92). Most recently I've started enabling offline functionality via IndexedDB and Service Worker.

---

I built this a long, long time ago, in the middle of the SPA era. Currently I'm re-writing it with newer application frameworks, first SvelteKit, then Next once they have their mutations API out. Nonetheless, it's designed so that all iterations will share the same data, data access, etc. Data is stored in Mongo, and, for now, served from a GraphQL endpoit built from my [mongo-graphql-starter
](https://www.npmjs.com/package/mongo-graphql-starter) project, although Next/SvelteKit will likely eliminate that.
