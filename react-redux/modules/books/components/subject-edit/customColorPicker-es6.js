import React from 'react';
import 'jscolor';

let uniqueIdCounter = 0;

class CustomColorPicker extends React.Component {
    constructor(){
        super();
        this.uniqueId = `customColorPickerId${++uniqueIdCounter}`
    }
    get valueElementId(){ return `${this.uniqueId}_value` }
    get styleElementId(){ return `${this.uniqueId}_style` }
    componentDidMount(){
        let onColorChosen = this.props.onColorChosen,
            rootElement = document.getElementById(this.uniqueId);

        this._colorChosen = function(){
            let hexColor = this.rgb.map(num => (~~num).toString(16)).map(num => num == 0 ? '00' : num).join('');
            onColorChosen('#' + hexColor)
        }
        new jscolor(rootElement, { valueElement: this.valueElementId, styleElement: this.styleElementId, onFineChange: this._colorChosen });
    }
    shouldComponentUpdate(){ return false; }
    render(){
        return (
            <div>
                <a id={`${this.uniqueId}`} onchange="alert('hi')"
                    style={{ width: '80px', height: '20px' }}>Custom</a>
                <input style={{ display: 'none' }} id={this.valueElementId} value="ff0000" />
                <input style={{ display: 'none' }} id={this.styleElementId} id="styleInput" />
            </div>
        );
    }
}

export default CustomColorPicker;