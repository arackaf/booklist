import React from 'react';

export const LabelDisplay = props => {
    let item = props.item,
        extraStyles = props.style || {},
        extraClasses = props.className || '';

    return (
        <span style={{ backgroundColor: item.backgroundColor, color: item.textColor || 'white', ...extraStyles }} className={'label label-default ' + extraClasses}>
            {props.children}
        </span>
    );
};

export const RemovableLabelDisplay = props => {
    let item = props.item,
        extraStyles = props.style || {},
        extraClasses = props.className || '';

    return (
        <span style={{ backgroundColor: item.backgroundColor, color: item.textColor || 'white', ...extraStyles }}  className={'label label-default ' + extraClasses}>
            <a onClick={props.doRemove} style={{ color: item.textColor || 'white', cursor: 'pointer' }}>X</a>
            <span style={{ marginLeft: 5, paddingLeft: 5, borderLeft: '1px solid white' }}>{props.name}</span>
            {props.children}
        </span>
    );
}