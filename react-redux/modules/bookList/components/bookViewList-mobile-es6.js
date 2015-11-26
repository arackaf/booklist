const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');
const AjaxButton = require('/react-redux/applicationRoot/rootComponents/ajaxButton');

class BookViewListMobile extends React.Component{
    constructor(){
        super();
    }
    render(){
        return (
            <div>
                { this.props.list.map((book, i) =>
                    <div key={'book' + i}>
                        Hey there - MOBILE
                    </div>
                )}
            </div>
        );
    }
}

module.exports = BookViewListMobile;