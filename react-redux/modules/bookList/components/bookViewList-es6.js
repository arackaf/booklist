const { loadBooks, editSubjectsForBook, addSubjectToBook, loadBooksAndSubjects } = require('../actions/actionCreators');
const { responsiveMobileDesktopMixin } = require('/react-redux/util/responsiveUiLoaders');
const Collapse = ReactBootstrap.Collapse;

function BookListLoading() {
    return <div style={{ height: '150' }}>Loading <i className="fa fa-spinner fa-spin"></i></div>
}

function BookListNoResults() {
    return <div style={{ height: '150' }}>No results</div>
}


class HierarchicalSubjectItem extends React.Component {
    constructor(){
        super();
        this.state = { childrenVisible: false };
    }
    toggleChildren(){
        this.setState({childrenVisible: !this.state.childrenVisible});
    }
    render(){
        return (
            <li key={this.props._id}>
                {this.props.children.length ?
                    <div>
                        <a onClick={() => this.toggleChildren()}>{this.props.name}</a>
                        <Collapse in={this.state.childrenVisible}>
                            <div>
                                <HierarchicalSubjectList subjects={this.props.children} />
                            </div>
                        </Collapse>
                    </div>: <span>{this.props.name}</span>}
            </li>
        )
    }
}

class HierarchicalSubjectList extends React.Component {
    render() {
        return (
            <ul>
                { this.props.subjects.map(s => <HierarchicalSubjectItem key={`s-${s._id}`} {...s} />) }
            </ul>
        )
    }
}

class BookViewingList extends React.Component {
    constructor(){
        super();

        responsiveMobileDesktopMixin(this, 'listComponent', {
            mobile:  { path: './modules/bookList/components/bookViewList-mobile', connectWith: state => state.bookList },
            desktop: { path: './modules/bookList/components/bookViewList-desktop', connectWith: state => state.bookList }
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

                    <HierarchicalSubjectList subjects={this.props.subjects} />


                    { !this.state.listComponent || this.props.loading ? <BookListLoading /> :
                        (this.props.bookList.length ?
                            React.createElement(this.state.listComponent, { addSubject: s => this.addSubject(s) })
                            : <BookListNoResults />)
                    }
                </div>
            </div>
        );
    }
}

module.exports = BookViewingList;