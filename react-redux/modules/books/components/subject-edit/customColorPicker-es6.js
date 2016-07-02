import React from 'react';
import 'jscolor';

let uniqueIdCounter = 0;

class CustomColorPicker extends React.Component {
    constructor(){
        super();
        this.uniqueId = `customColorPickerId${++uniqueIdCounter}`
        this.state = {  }
    }
    get valueElementId(){ return `${this.uniqueId}_value` }
    get styleElementId(){ return `${this.uniqueId}_style` }
    componentDidMount(){
        let colorPicker = document.getElementById(this.uniqueId);
        this.picker = new jscolor(colorPicker, { valueElement: this.valueElementId, styleElement: this.styleElementId });

        this._colorChanged = function(){
            console.log('changed to', this.value);
        }
        alert(this.valueElementId);
        document.getElementById(this.valueElementId).addEventListener('change', this._colorChanged);
    }
    colorChange(){
        console.log('changed to', this.value);
    }
    componentWillUnmount(){
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