let { loadBooks } = require('../actions/actionCreators');

class BookEntryList extends React.Component {
    constructor(){
        super();
        this.state = { listItem: null };
        this.switchToDesktop();
    }
    componentDidMount(){
        setTimeout(() => this.props.dispatch(loadBooks()), 2000);
    }
    switchToDesktop(){
        System.import('./modules/bookList/components/bookViewListItem-desktop').then(component => this.setState({ listItem: component }));
    }
    switchToMobile(){
        System.import('./modules/bookList/components/bookViewListItem-mobile').then(component => this.setState({ listItem: component }));
    }
    render() {
        return (
            <div>
                <button onClick={() => this.switchToDesktop()}>Desktop</button>
                <button onClick={() => this.switchToMobile()}>Mobile</button>
                Root list -> <br/><br/>

                { this.state.listItem ?
                    Array.from({ length: 10 }).map((o, i) => React.createElement(this.state.listItem, { key: 'el' + i })) : '<Loading...>' }

            </div>
        );
    }
}

module.exports = BookEntryList;