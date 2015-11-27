const { loadBooks } = require('../actions/actionCreators');
const { responsiveMobileDesktopMixin } = require('/react-redux/util/responsiveUiLoaders');

function BookListLoading() {
    return <div style={{ height: '150' }}>Loading ...</div>
}

function BookListNoResults() {
    return <div style={{ height: '150' }}>No results</div>
}

class BookViewingList extends React.Component {
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
            <div className="panel panel-default" style={{ margin: '15' }}>
                <div className="panel-body">
                    <button onClick={() => this.switchToDesktop()}>Desktop</button>
                    <button onClick={() => this.switchToMobile()}>Mobile</button>
                    <br/><br/>

                    { !this.state.listComponent || this.props.loading ? <BookListLoading /> :
                        (this.props.bookList.length ? React.createElement(this.state.listComponent, { list: this.props.bookList }) : <BookListNoResults />) }
                </div>
            </div>
        );
    }
}

module.exports = BookViewingList;