const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const AjaxButton = require('/react-redux/applicationRoot/rootComponents/ajaxButton');

class BookViewListDesktop extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <div>
            { this.props.list.map((book, i) =>
                <div key={'book' + i}>
                    Hey there - DESKTOP
                </div>
            )}
            </div>
        );
    }
}

module.exports = BookViewListDesktop;