const { loadBooks, loadSubjects, editSubjectsForBook, addSubjectToBook, loadBooksAndSubjects } = require('../actions/actionCreators');
const { responsiveMobileDesktopMixin } = require('/react-redux/util/responsiveUiLoaders');

import MainNavigationBar from '/react-redux/applicationRoot/rootComponents/mainNavigation';
import * as actionCreators from '../actions/actionCreators';

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
        this.props.dispatch(loadSubjects());
    }
    componentWillReceiveProps(newProps){
        if (newProps.bookSearch.isDirty){
            this.props.dispatch(loadBooks());
        }
    }
    addSubject(subject){
        this.props.dispatch(addSubjectToBook(subject));
    }
    render() {
        return (
            <div>
                <MainNavigationBar isBookList={true}></MainNavigationBar>
                <div className="panel panel-default" style={{ margin: '10' }}>
                    <div className="panel-body">
                        <button onClick={() => this.switchToDesktop()}>Desktop</button>
                        <button onClick={() => this.switchToMobile()}>Mobile</button>
                        <br/><br/>

                        { !this.state.listComponent
                            ? <BookListLoading />
                            : React.createElement(this.state.listComponent, { addSubject: s => this.addSubject(s) })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = BookViewingList;