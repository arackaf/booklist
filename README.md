# booklist

This repo is where I learn and play with new technologies.  The idea is to implement a fully functioning book collection website—basically a more realistic 
version of ToDo. 

All iterations will share the same data, data access, controllers, and AWS access code.  Controllers are sniffed out and wired with my easy-express-controllers 
project (https://www.npmjs.com/package/easy-express-controllers); data access is through Mongo; and all book info is looked up with my own AWS credentials, 
subject to an unfortunate one-request-per-second limit imposed by Amazon.

The first iteration, in progress, is with ReactJS, Redux and Bootstrap.  The (by no means comprehensive) tests are run with Gulp, Mocha, and Chai.  ES6
transpilation is with Babel, with Stage 1 features enabled to get decorators working, which are needed for the controller actions.  I'm also using the React-Bootstrap
extensions, for things like Modal and Collapse.

Future iterations may potentially look at ... whatever is thriving whenever the React version is done.