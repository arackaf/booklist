let ResponsiveNotifier = require('/utils/responsiveChangeNotifier');
let { loadBooks } = require('../actions/actionCreators');

const responsiveBsSizes = ['xs', 'sm', 'md', 'lg'];

function responsiveMobileDesktopMixin(self, stateName, config){
    let currentlyMobile;

    const cutoff = config.cutoff || 'sm';
    const mobileCutoffIndex = responsiveBsSizes.indexOf(cutoff);

    if (!self.state){
        self.state = { [stateName]: null };
    } else {
        self.state[stateName] = null;
    }

    self.responsiveNotifier = new ResponsiveNotifier(val => checkSize(val));

    self.switchToMobile = function(){
        this.overridden = true;
        loadComponent.call(self, config.mobile);
    };

    self.switchToDesktop = function(){
        this.overridden = true;
        loadComponent.call(self, config.desktop);
    };

    function checkSize(currentSize){
        if (self.overridden) return;

        let isMobile = responsiveBsSizes.indexOf(currentSize) <= mobileCutoffIndex;
        if (isMobile !== currentlyMobile){
            currentlyMobile = isMobile;
            loadComponent(currentlyMobile ? config.mobile : config.desktop);
        }
    }

    function loadComponent(componentPath){
        System.import(componentPath).then(component => self.setState({ [stateName]: component }));
    }
}

    class BookEntryList extends React.Component {
        constructor(){
            super();

            responsiveMobileDesktopMixin(this, 'listComponent', {
                mobile:  './modules/bookList/components/bookViewList-mobile',
                desktop: './modules/bookList/components/bookViewList-desktop'
            });
        }
        componentDidMount(){
        this.props.dispatch(loadBooks());
    }
    render() {
        return (
            <div>
                <button onClick={() => this.switchToDesktop()}>Desktop</button>
                <button onClick={() => this.switchToMobile()}>Mobile</button>
                Root list -> <br/><br/>

                { this.state.listComponent ?
                    React.createElement(this.state.listComponent, { list: this.props.bookList }) : '<Loading...>' }

            </div>
        );
    }
}

module.exports = BookEntryList;