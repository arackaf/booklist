import React, { Component } from "react";

import colorClasses from "css/color-picker.module.scss";

const { colorChoice, colorChoiceCurrent } = colorClasses;

export default class ColorsPalette extends Component<any, any> {
  render() {
    let { currentColor, colors, onColorChosen } = this.props;

    return (
      <div>
        {colors.map(color => (
          <div
            key={color}
            className={`${colorChoice} ${color == currentColor ? colorChoiceCurrent : ""}`}
            onClick={() => onColorChosen(color)}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    );
  }
}
