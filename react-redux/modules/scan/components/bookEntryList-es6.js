import BookEntryItem from './bookEntryItem';

const { TransitionMotion, spring } = ReactMotion;
const Collapse = ReactBootstrap.Collapse;

import * as bookEntryActionCreators from '../actions/actionCreators';
import MainNavigationBar from 'root-components/mainNavigation';
import BootstrapButton from 'root-components/bootstrapButton';
import ManualBookEntry from './manualBookEntry';

class BookEntryList extends React.Component {
    constructor(){
        super();
        this.state = { showIncomingQueue: false, showScanInstructions: false };
    }
    toggleScanInstructions(){
        this.setState({ showScanInstructions: !this.state.showScanInstructions });
    }
    toggleIncomingQueue(){
        this.setState({ showIncomingQueue: !this.state.showIncomingQueue });
    }
    beginEntry(){
        this.setState({ inManualEntry: true });
    }
    manualEntryEnding(){
        this.setState({ inManualEntry: false });
    }
    render() {
        let pending = this.props.pendingNumber,
            toggleClass = this.state.showIncomingQueue ? 'fa-angle-double-up' : 'fa-angle-double-down',
            toggleInstructionClass = this.state.showScanInstructions ? 'fa-angle-double-up' : 'fa-angle-double-down',
            toggleInstructions = <a onClick={() => this.toggleScanInstructions()}><i className={`fa fa-question-circle`}></i></a>,
            toggleShow = this.props.booksJustSaved.length || pending ?
                <a onClick={() => this.toggleIncomingQueue()}><i style={{ color: 'white' }} className={`fa fa-white ${toggleClass}`}></i></a>
                : null;

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
                                    <div className="alert alert-info margin-top alert-slim">
                                        Your entered and failed books will show up here, fleetingly, though everything is being logged.
                                        <br /><br />
                                        Eventually there'll be a dedicated module to let you see what's been saved and what failed to be found, and of course saved books will show up in your books list.
                                    </div>

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
                            <h4 style={{ marginTop: 0, marginBottom: 0 }}>Enter your books here {toggleInstructions} <a className="btn btn-xs btn-primary" onClick={() => this.beginEntry()}>Manual entry</a></h4>
                            <Collapse in={this.state.showScanInstructions}>
                                <div>
                                    <div style={{ height: 10 }}></div>
                                    <div style={{ margin: 0 }} className="alert alert-info alert-slim">
                                        Enter each isbn below, and press "Retrieve and save all" to search for all entered books. Or, use a barcode
                                        scanner to search for each book immediately (pressing enter after typing in a 10 or 13 digit isbn has the same effect).
                                        <br /> <br />
                                        After you enter the isbn in the last textbox, focus will jump back to the first.  This is to make scanning a large number
                                        of books with a barcode scanner as smooth as possible; just make sure you don't have any partially-entered ISBNs up top, or else
                                        they may get overridden.
                                    </div>
                                </div>
                            </Collapse>
                            <br />
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
                            <div>
                                <BootstrapButton preset="primary" onClick={() => this.saveAll()}>Retrieve and save all</BootstrapButton>
                                <BootstrapButton preset="default" className="pull-right" onClick={this.props.resetList}>Reset list</BootstrapButton>
                            </div>

                        </div>
                    </div>
                </div>

                <ManualBookEntry isOpen={this.state.inManualEntry} onClosing={() => this.manualEntryEnding()} />

            </div>
        );
    }
    componentDidMount(){
        this.ws = new WebSocket(webSocketAddress('/bookEntryWS'));

        this.ws.onmessage = ({ data }) => {
            let packet = JSON.parse(data);
            if (packet._messageType == 'initial'){
                this.props.setPending(packet.pending);
            } else if (packet._messageType == 'bookAdded') {
                this.props.bookSaved(packet);
            } else if (packet._messageType == 'pendingBookAdded'){
                this.props.incrementPending();
            } else if (packet._messageType == 'bookLookupFailed'){
                this.props.bookLookupFailed(packet.isbn);
            }
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
    isbnChanged(entry, e){
        this.props.updateIsbn(e.target.value, this.props.entryList.indexOf(entry));
    }
    entryFinished(entry){
        let index = this.props.entryList.indexOf(entry);
        if (index < this.props.entryList.length - 1){
            this.refs['Book' + (index + 1)].focusInput();
            this.refs['Book' + (index + 1)].selectInput();
        } else {
            this.refs['Book0'].focusInput();
            this.refs['Book0'].selectInput();
        }

        if (entry.isbn.length == 10 || entry.isbn.length == 13){
            this.props.enterBook(index, entry.isbn);
        }
    }
}

const BookEntryListConnected = ReactRedux.connect(state => state, { ...bookEntryActionCreators })(BookEntryList);

export default BookEntryListConnected;