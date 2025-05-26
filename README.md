# booklist

A web app to track your book collection, currently hosted at [https://mylibrary.io/](https://mylibrary.io/)

I built this as a fun way to learn web dev tools I'm interested in, and to track my own library. You can scan your books, which are looked up via the ISBN DB API, or manually enter them. Books can be searched, tagged, and organized with hierarchical subjects. There's also some crude data visualizations (made with D3) and a way to find book recommendations based on similarity searches against a set of books you select. Public (read-only) access to your library can also be opted into—mine are here [here](https://mylibrary.io/view?userId=573d1b97120426ef0078aa92).

---

I built this a long, long time ago, in the middle of the SPA era. It was originally a React SPA. I built a Svelte version, and more recently I moved it over to SvelteKit, which is my favorite iteration so far.

Data were originally stored in Mongo and served via a GraphQL layer I built with [this other](https://github.com/arackaf/mongo-graphql-starter) side project. It then moved to MySQL on PlanetScale, and finally to Postgres, hosted on Fly.io.
