import React, { Component } from "react";
import "jscolor";

declare var jscolor: any;

let uniqueIdCounter = 0;

class CustomColorPicker extends Component<any, any> {
  uniqueId = `customColorPickerId${++uniqueIdCounter}`;
  _colorChosen: () => any;
  jscolorInstance: any;
  rootElement: any;
  valueElement: any;
  get valueElementId() {
    return `${this.uniqueId}_value`;
  }
  get styleElementId() {
    return `${this.uniqueId}_style`;
  }
  onColorChosen: any;
  componentDidMount() {
    let inst = this;

    this._colorChosen = function() {
      let hexColor = this.rgb
        .map(n => (~~n).toString(16))
        .map(n => (n.length == 1 ? `0${n}` : n))
        .join("");
      inst.props.onColorChosen("#" + hexColor);
    };
    this.jscolorInstance = new jscolor(this.rootElement, {
      valueElement: this.valueElementId,
      styleElement: this.styleElementId,
      onFineChange: this._colorChosen
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentColor) {
      this.jscolorInstance.fromString(this.props.currentColor);
    }
  }
  render() {
    return (
      <div>
        <a id={`${this.uniqueId}`} ref={el => (this.rootElement = el)} style={{ height: "20px", ...(this.props.labelStyle || {}) }}>
          Custom
        </a>
        <input style={{ display: "none" }} ref={el => (this.valueElement = el)} id={this.valueElementId} defaultValue={this.props.currentColor} />
        <input style={{ display: "none" }} id={this.styleElementId} />
      </div>
    );
  }
}

export default CustomColorPicker;
