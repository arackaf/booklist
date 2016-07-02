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
        let self = this;
        this.colorPicker = document.getElementById(this.uniqueId);
        this.picker = new jscolor(this.colorPicker, { valueElement: this.valueElementId, styleElement: this.styleElementId });

        this._colorChanged = function(){
            self.props.onColorChosen('#' + this.value);
        }
        document.getElementById(this.valueElementId).addEventListener('change', this._colorChanged);
    }
    componentWillUnmount(){
        let rtrrt = this.colorPicker;
        debugger;
        document.getElementById(`${this.uniqueId}_value`).removeEventListener('change', this._colorChanged);
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