const cssPresets = { };
const buttonTypes = ['default', 'primary', 'success', 'info', 'warning', 'danger'];
const buttonSizes = ['lg', 'sm', 'xs'];

buttonTypes.forEach(t => {
    cssPresets[t] = `btn-${t}`; //default size
    buttonSizes.forEach(s => {
        cssPresets[`${t}-${s}`] = `btn-${t} btn-${s}`;
    });
});

class BootstrapButton extends React.Component{
    constructor(props){
        super();
        this.state = { btnCss: (props.className || '') + ' btn ' + (cssPresets[props.preset] || props.css || '') };
    }
    render(){
        return (
            <button className={this.state.btnCss} style={{ ...this.props.style }} onClick={this.props.onClick} disabled={this.props.disabled}>{this.props.children}</button>
        )
    }
}

export default BootstrapButton;