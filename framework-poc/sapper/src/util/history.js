const historyModule = require("history");

//FUCK SSR
const historyManager = typeof window == "object" ? historyModule.createBrowserHistory : historyModule.createMemoryHistory;
const history = historyManager();

export default history;
