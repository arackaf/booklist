import BookEntryItem from './bookEntryItem';

const { TransitionMotion, spring } = ReactMotion;
const Collapse = ReactBootstrap.Collapse;

import * as bookEntryActionCreators from '../actions/actionCreators';
import MainNavigationBar from '/react-redux/applicationRoot/rootComponents/mainNavigation';

class BookEntryList extends React.Component {
    constructor(){
        super();
        this.state = { showIncomingQueue: false };
    }
    toggleIncomingQueue(){
        this.setState({ showIncomingQueue: !this.state.showIncomingQueue });
    }
    render() {
        let pending = this.props.pendingNumber,
            toggleClass = this.state.showIncomingQueue ? 'fa-angle-double-up' : 'fa-angle-double-down',
            toggleShow = <a onClick={() => this.toggleIncomingQueue()}><i style={{ color: 'white' }} className={`fa fa-white ${toggleClass}`}></i></a>;

        return (
            <div>
                <MainNavigationBar isBookEntry={true}></MainNavigationBar>
                <div className='panel panel-default' style={ { 'margin': '15px', padding: '15px' } }>
                    <div className="row">
                        <div style={{ marginBottom: 30 }} className="col-md-6 col-md-push-6">
                            <div>
                                { pending == null ? null :
                                    (pending
                                        ? <span className="label label-info">{`${pending} Book${pending === 1 ? '' : 's'} currently outstanding`} { toggleShow }</span>
                                        : <span className="label label-success">All pending books saved { toggleShow }</span>)
                                }
                            </div>

                            <Collapse in={this.state.showIncomingQueue}>
                                <div>
                                    <TransitionMotion
                                        willEnter={() => ({ opacity: 0.1 })}
                                        styles={this.props.booksJustSaved.map(book => ({
                                  style: { opacity: spring(1) },
                                  data: book,
                                  key: book._id
                                }))}>
                                        {styles =>
                                            <ul>{
                                                styles.map(({ style, data: book, key }) => <li key={key} style={{...style}}>{book.title}</li>)
                                            }</ul>
                                        }
                                    </TransitionMotion>
                                </div>
                            </Collapse>
                        </div>
                        <div className="col-md-6 col-md-pull-6">
                            { this.props.entryList.map((entry, i) =>
                                <div key={i}>
                                    <BookEntryItem
                                        ref={'Book' + i}
                                        { ...entry }
                                        isbnChange={e => this.isbnChanged(entry, e)}
                                        entryFinished={() => this.entryFinished(entry)}
                                        index={i}
                                        deleteBook={() => this.deleteBook(entry)}
                                    />
                                    <br />
                                </div>
                            )}
                            <button onClick={() => this.saveAll()}>Retrieve and save all</button>
                            <br />
                            <br />
                            <button onClick={this.props.resetList}>Reset list</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    componentDidMount(){
        this.ws = new WebSocket(webSocketAddress('/bookEntryWS'));

        this.ws.onmessage = ({ data }) => {
            let packet = JSON.parse(data);
            console.log(packet);
            if (packet._messageType == 'initial'){
                this.props.setPending(packet.pending);
            } else if (packet._messageType == 'bookAdded') {
                this.props.bookSaved(packet);
            } else if (packet._messageType == 'pendingBookAdded'){
                this.props.incrementPending();
            }
            packet.title && console.log('from node:', packet.title);
        };

        this.refs.Book0.focusInput();
    }
    componentWillUnmount(){
        try {
            this.ws.close();
        } catch(e){}
    }
    saveAll(){
        this.props.saveAllPending();
    }
    deleteBook(entry){
        this.props.deleteBook(this.props.entryList.indexOf(entry), entry.fetchedInfo._id);
    }
    isbnChanged(entry, e){
        this.props.updateIsbn(e.target.value, this.props.entryList.indexOf(entry));
    }
    entryFinished(entry){
        let index = this.props.entryList.indexOf(entry);
        if (index < this.props.entryList.length - 1){
            this.refs['Book' + (index + 1)].focusInput();
        }

        if (entry.isbn.length == 10 || entry.isbn.length == 13){
            this.props.loadAndSaveBook(index, entry.isbn);
        }
    }
}

const BookEntryListConnected = ReactRedux.connect(state => state, { ...bookEntryActionCreators })(BookEntryList);

export default BookEntryListConnected;