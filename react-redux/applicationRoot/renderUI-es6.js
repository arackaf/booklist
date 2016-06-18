const Provider = ReactRedux.Provider;
import Header from './rootComponents/header';
import { store } from './store';

export function clearUI(){
    ReactDOM.render(
        <div></div>,
        document.getElementById('home')
    );
}

export function renderUI(component){
    ReactDOM.render(
        <Provider store={store}>
            <div>
                { component }
            </div>
        </Provider>,
        document.getElementById('home')
    );
}
