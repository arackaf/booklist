# booklist

This is my attempt at a fully functioning book collection website as a way to learn and try out modern development tools I'm 
interested in, but don't get to use professionally. Progress is limited to what little free time I can find, which means it's slow; expect many parts of this
to be grossly incomplete at any given time.  At the moment you can create an account, scan in books, which are looked up via AWS, and then view, edit, filter,
and tag your books with (hierarchical) subjects as desired.

All iterations will share the same data, data access, controllers, and AWS access code.  Controllers are sniffed out and wired with my easy-express-controllers 
project (https://www.npmjs.com/package/easy-express-controllers); data access is through Mongo; and all book info is looked up with my own AWS credentials, 
subject to an unfortunate one-request-per-second limit imposed by Amazon.

The first iteration, which is still in progress, is with React, Redux and Bootstrap, and is in the react-redux directory.  The (by no means comprehensive) tests 
are run with Gulp, Mocha, and Chai.  ES6 transpilation is through Babel, with Stage 1 features enabled to get decorators working, which are needed for 
the controller actions.  React-Bootstrap is used to get things like Modal, NavBar and Collapse working, and I've also added react-dropzone to support 
uploading book cover images (for when AWS doesn't have it for some reason), and sooner or later I'll get around to adding D3 to mess around with data visualization.

Future iterations may potentially look at ... whatever is thriving whenever the React version is done.