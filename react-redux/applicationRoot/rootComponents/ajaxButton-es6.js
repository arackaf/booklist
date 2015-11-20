class AjaxButton extends React.Component{
    render(){
        return (
            <button className={'btn ' + (this.props.css || '')} onClick={this.props.onClick} disabled={this.props.running}>{this.props.running ? this.props.runningText || this.props.text : this.props.text}</button>
        )
    }
}

module.exports = AjaxButton;