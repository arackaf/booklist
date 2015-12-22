const { loadBooks, editSubjectsForBook, addSubjectToBook, loadBooksAndSubjects } = require('../actions/actionCreators');
const { responsiveMobileDesktopMixin } = require('/react-redux/util/responsiveUiLoaders');
const actionCreators = require('../actions/actionCreators');

const { selector } = require('../reducers/reducer');

function BookListLoading() {
    return <div style={{ height: '150' }}>Loading <i className="fa fa-spinner fa-spin"></i></div>
}

function BookListNoResults() {
    return <div style={{ height: '150' }}>No results</div>
}

class BookViewingList extends React.Component {
    constructor(){
        super();

        responsiveMobileDesktopMixin(this, 'listComponent', {
            mobile:  { path: './modules/bookList/components/bookViewList-mobile', connectWith: selector },
            desktop: { path: './modules/bookList/components/bookViewList-desktop', connectWith: selector, mapDispatchWith: actionCreators }
        });
    }
    componentDidMount(){
        this.props.dispatch(loadBooksAndSubjects());
    }
    addSubject(subject){
        this.props.dispatch(addSubjectToBook(subject));
    }
    render() {
        return (
            <div className="panel panel-default" style={{ margin: '15' }}>
                <div className="panel-body">
                    <button onClick={() => this.switchToDesktop()}>Desktop</button>
                    <button onClick={() => this.switchToMobile()}>Mobile</button>
                    <br/><br/>

                    { !this.state.listComponent || this.props.books.loading ? <BookListLoading /> :
                        (this.props.books.list.length ?
                            React.createElement(this.state.listComponent, { addSubject: s => this.addSubject(s) })
                            : <BookListNoResults />)
                    }
                </div>
            </div>
        );
    }
}

module.exports = BookViewingList;