
const { renderUI, clearUI } = require('/react-redux/applicationRoot/renderUI');
const { store, getNewReducer } = require('/react-redux/applicationRoot/store');

require('/utils/ajaxUtil');

let currentModule;

window.onhashchange = function () {
    loadCurrentModule();
};

loadCurrentModule();

function loadCurrentModule() {
    let hash = window.location.hash.replace('#', ''),
        module = hash.split('/')[0] || 'bookList';

    if (module === currentModule) return;
    currentModule = module;

    System.import(`./modules/${module}/${module}`).then(module => {
        clearUI();
        getNewReducer({ name: module.name, reducer: module.reducer });
        renderUI(module.component);
    });
}