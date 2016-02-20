const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');

class AjaxButton extends BootstrapButton {
    render(){

        let result = this.props.running
            ? <button className={this.state.btnCss} disabled={true}><i className="fa fa-fw fa-spin fa-spinner"></i>{ ' ' + this.props.runningText || this.props.text}</button>
            : <button className={this.state.btnCss} onClick={this.props.onClick}>{ this.props.children }</button>;

        return result;
    }
}

module.exports = AjaxButton;