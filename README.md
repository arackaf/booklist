# booklist

A web app to track your book collection, currently hosted at [https://mylibrary.io/](https://mylibrary.io/) (and [https://svelte.mylibrary.io](https://svelte.mylibrary.io))

I built this as a decent way to try and learn modern web dev tools I'm interested in, and to track my own library. You can scan your books, which are looked up via the ISBN DB API, or manually enter them. Books can be searched, tagged, and organized with hierarchical subjects. There's also some crude data visualizations (made with D3) and a way to find book recommendations based on similarity searches against a set of books you select. Public (read-only) access to your library can also be opted into—mine here [here](https://mylibrary.io/view?userId=573d1b97120426ef0078aa92).

---

I built this a long, long time ago, in the middle of the SPA era. It was originally a React SPA. I built a Svelte version, and more recently I moved it over to SvelteKit, which is my favorite iteration by far.

Data were originally stored in Mongo and served via a GraphQL layer I built with [this other](https://github.com/arackaf/mongo-graphql-starter) side project of mine. But now it's all in MySQL, hosted by PlanetScale, and served up by SvelteKit api endpoints.
