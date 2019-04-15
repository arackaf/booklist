import React, { Component } from "react";

import "css/color-picker.css";

export default class ColorsPalette extends Component<any, any> {
  render() {
    let { currentColor, colors, onColorChosen } = this.props;

    return (
      <div>
        {colors.map(color => (
          <div
            key={color}
            className={`color-choice ${color == currentColor ? "color-choice-current" : ""}`}
            onClick={() => onColorChosen(color)}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    );
  }
}
