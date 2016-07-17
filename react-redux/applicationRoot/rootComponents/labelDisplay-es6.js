export const LabelDisplay = props => {
    let extraStyles = props.style || {};

    return (
        <span style={{ backgroundColor: item.backgroundColor, color: item.textColor || 'white', ...extraStyles }} className="label label-default">
            {props.children}
        </span>
    );
};

export const RemovableLabelDisplay = props => {
    let extraStyles = props.style || {};
    let item = props.item;

    return (
        <span style={{ backgroundColor: item.backgroundColor, color: item.textColor || 'white', ...extraStyles }} className="label label-default">
            <a onClick={props.doRemove} style={{ color: item.textColor || 'white', cursor: 'pointer' }}>X</a>
            <span style={{ marginLeft: 5, paddingLeft: 5, borderLeft: '1px solid white' }}>{props.name}</span>
            {props.children}
        </span>
    );
}