const cssPresets = { };
const buttonTypes = ['default', 'primary', 'success', 'info', 'warning', 'danger'];
const buttonSizes = ['lg', 'sm', 'xs'];

buttonTypes.forEach(t => {
    cssPresets[t] = t; //default size
    buttonSizes.forEach(s => {
        cssPresets[`${t}-${s}`] = `btn-${t} btn-${s}`;
    });
});

class BootstrapButton extends React.Component{
    constructor(props){
        super();
        this.state = { btnCss: 'btn ' + (cssPresets[props.preset] || props.css || '') };
    }
    render(){
        return (
            <button className={this.state.btnCss} onClick={this.props.onClick} disabled={this.props.disabled}>{this.props.children}</button>
        )
    }
}

module.exports = BootstrapButton;