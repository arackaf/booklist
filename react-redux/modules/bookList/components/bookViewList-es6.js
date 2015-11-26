const { loadBooks } = require('../actions/actionCreators');
const { responsiveMobileDesktopMixin } = require('/react-redux/util/responsiveUiLoaders');

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