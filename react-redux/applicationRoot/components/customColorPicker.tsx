import React, {Component} from 'react';
import 'jscolor';

declare var jscolor: any;

let uniqueIdCounter = 0;

class CustomColorPicker extends Component<any, any> {
    uniqueId: string
    _colorChosen: () => any
    jscolorInstance: any
    rootElement: any
    valueElement: any
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
        this.jscolorInstance = new jscolor(this.rootElement, { valueElement: this.valueElementId, styleElement: this.styleElementId, onFineChange: this._colorChosen });
    }
    shouldComponentUpdate(props){
        if (props.currentColor) {
            this.jscolorInstance.fromString(props.currentColor);
        }
        return false;
    }
    render(){
        return (
            <div>
                <a id={`${this.uniqueId}`} ref={ el => this.rootElement = el } style={{ width: '80px', height: '20px', ...(this.props.labelStyle || {}) }}>Custom</a>
                <input style={{ display: 'none' }} ref={el => this.valueElement = el} id={this.valueElementId} defaultValue={this.props.currentColor} />
                <input style={{ display: 'none' }} id={this.styleElementId} />
            </div>
        );
    }
}

export default CustomColorPicker;