import React, {Component} from 'react';

export default class ColorsPalette extends Component{
    render(){
        let {currentColor, colors, onColorChosen} = this.props;

        return (
            <div>
                { colors.map(color => <div className={`color-choice ${color == currentColor ? 'color-choice-current' : ''}`} onClick={() => onColorChosen(color) } style={{ backgroundColor: color }}></div>) }
            </div>
        );
    }
}