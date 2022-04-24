import React, { Component } from "react";

import "styles/color-picker.scss";

export default class ColorsPalette extends Component<any, any> {
  render() {
    let { currentColor, colors, onColorChosen } = this.props;

    return (
      <div className="color-palette-root">
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
