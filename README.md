# booklist

A fully functioning book collection website hosted at http://mylibrary.io/ 

I made this as a way to learn and try out modern development tools I'm interested in, and also to track my own library. Progress is limited to whatever time I can find, which means parts of this may be incomplete at any given time.  Currently you can create an account; scan in books, which are looked up via AWS; view, edit, filter, and tag your books with (hierarchical) subjects as desired; and most recently I've added a drag and drop UI to manage these hierarchical subjects.

The books view looks something like this 

<img src="static/readmePics/bookGridView.png" alt="main desktop table view" style="width: 812px; height: 481px" />

and there's a somewhat decent mobile view

<img src="static/readmePics/bookBasicListView.jpg" alt="mobile friendly view 1" style="width: 320px; height: 568px" />

---

I initially made this with the goal of creating iterations of the site with React, Angular, Aurelia, etc. So far I've felt no desire to leave React or stop iterating on the (single) React iteration. Nonetheless, it's designed so that all iterations will share the same data, data access, controllers, and AWS access code.  Controllers are sniffed out and wired with my [easy-express-controllers 
](https://www.npmjs.com/package/easy-express-controllers) project; data access is through Mongo; and all book info is looked up with my own AWS credentials, subject to an unfortunate one-request-per-second limit imposed by Amazon.

The current React iteration uses Redux, and is in the react-redux directory.  ES6 transpilation is through Babel (of course), with Stage 2 features enabled for things like object spread.  My own, small [simple-react-bootstrap](https://www.npmjs.com/package/simple-react-bootstrap) project provides React bindings for the Bootstrap components Modal, NavBar and Collapse. I've also added react-dropzone to support uploading book cover images (for when AWS doesn't have it for some reason), and the drag and drop for the subjects screen is currently made with react-dnd, though I plan to move to Dragula. And of course webpack is used for the build.

My next goal is to add D3 and create some cool data visualizations.

Future iterations may potentially look at ... whatever is thriving whenever the React version is done, if it ever is...