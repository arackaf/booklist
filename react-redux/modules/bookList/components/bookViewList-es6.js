let { loadBooks } = require('../actions/actionCreators');

class BookEntryList extends React.Component {
    constructor(){
        super();

        this.state = { listComponent: null };
        this.switchToDesktop();
    }
    componentDidMount(){
        this.props.dispatch(loadBooks());
    }
    switchToDesktop(){
        System.import('./modules/bookList/components/bookViewList-desktop').then(component => this.setState({ listComponent: component }));
    }
    switchToMobile(){
        System.import('./modules/bookList/components/bookViewList-mobile').then(component => this.setState({ listComponent: component }));
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