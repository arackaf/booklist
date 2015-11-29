const { loadBooks, editSubjectsForBook, addSubjectToBook, loadSubjects } = require('../actions/actionCreators');
const { responsiveMobileDesktopMixin } = require('/react-redux/util/responsiveUiLoaders');

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
            mobile:  './modules/bookList/components/bookViewList-mobile',
            desktop: { path: './modules/bookList/components/bookViewList-desktop', connectWith: state => state.bookList }
        });
    }
    componentDidMount(){
        this.props.dispatch(loadBooks());
        this.props.dispatch(loadSubjects());
    }
    editSubjectsFor(index){
        this.props.dispatch(editSubjectsForBook(index));
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

                    <ul>
                        { this.props.subjects.map(s => <li key={s._id}>{s.name}</li>) }
                    </ul>


                    { !this.state.listComponent || this.props.loading ? <BookListLoading /> :
                        (this.props.bookList.length ?
                            React.createElement(this.state.listComponent, { addSubject: s => this.addSubject(s), editSubjectsFor: index => this.editSubjectsFor(index) })
                            : <BookListNoResults />)
                    }
                </div>
            </div>
        );
    }
}

module.exports = BookViewingList;