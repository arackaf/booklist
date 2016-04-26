const BootstrapButton = require('./bootstrapButton');

class AjaxButton extends BootstrapButton {
    render(){

        let result = this.props.running
            ? <button className={this.state.btnCss} disabled={true}><i className="fa fa-fw fa-spin fa-spinner"></i>{ (this.props.runningText || this.props.text) ? ' ' + this.props.runningText || this.props.text : this.props.children}</button>
            : <button className={this.state.btnCss} onClick={this.props.onClick}>{ this.props.children }</button>;

        return result;
    }
}

export default AjaxButton;