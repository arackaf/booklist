const BootstrapButton = require('/react-redux/applicationRoot/rootComponents/bootstrapButton');

class AjaxButton extends BootstrapButton {
    render(){
        return (
            <button className={this.state.btnCss} onClick={this.props.onClick} disabled={this.props.running}>{ this.props.running ? this.props.runningText || this.props.text : this.props.children }</button>
        )
    }
}

module.exports = AjaxButton;