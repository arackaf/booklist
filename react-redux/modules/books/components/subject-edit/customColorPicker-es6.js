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
        let onColorChosen = this.props.onColorChosen;

        this._colorChosen = function(){
            let hexColor = this.rgb.map(n => (~~n).toString(16)).map(n => n.length == 1 ? `0${n}` : n).join('');
            onColorChosen('#' + hexColor)
        }
        new jscolor(this.rootElement, { valueElement: this.valueElementId, styleElement: this.styleElementId, onFineChange: this._colorChosen });
    }
    shouldComponentUpdate(){ return false; }
    render(){
        return (
            <div>
                <a id={`${this.uniqueId}`} ref={ el => this.rootElement = el } style={{ width: '80px', height: '20px' }}>Custom</a>
                <input style={{ display: 'none' }} id={this.valueElementId} value={this.props.initialColor} />
                <input style={{ display: 'none' }} id={this.styleElementId} />
            </div>
        );
    }
}

export default CustomColorPicker;