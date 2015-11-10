class AjaxButton extends React.Component{
    render(){
        return (
            <button onClick={this.props.onClick} disabled={this.props.running}>{this.props.running ? this.props.runningText || this.props.text : this.props.text}</button>
        )
    }
}

module.exports = AjaxButton;