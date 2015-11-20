
const renderUI = require('/react-redux/applicationRoot/renderUI');
const { store, getNewReducer } = require('/react-redux/applicationRoot/store');
require('/utils/ajaxUtil');

System.import('./modules/bookEntry/bookEntry').then(module => {
    getNewReducer({ name: module.name, reducer: module.reducer });
    renderUI(module.component);
});