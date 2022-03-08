import React from "react";
import cn from "classnames";

export const LabelDisplay = props => {
  let item = props.item;
  let extraStyles = props.style || {};
  let extraClasses = props.className || "";
  let disabledStyles = {
    opacity: 0.4
  };
  let onClick = props.onClick;

  if (props.disabled) {
    Object.assign(extraStyles, disabledStyles, extraStyles);
  }

  return (
    <span
      onClick={onClick ? () => onClick(item) : void 0}
      style={{ cursor: onClick ? "pointer" : "default", backgroundColor: item.backgroundColor, color: item.textColor || "white", ...extraStyles }}
      className={"label label-default noselect " + extraClasses}
    >
      {props.children || item.name}
    </span>
  );
};

export const EditableExpandableLabelDisplay = props => {
  let { item, onEdit, expanded, setExpanded, childSubjects } = props;
  let extraStyles = props.style || {};
  let extraClasses = props.className || "";

  return (
    <span
      style={{ backgroundColor: item.backgroundColor, color: item.textColor || "white", ...extraStyles }}
      className={"label label-default label-editable-expandable noselect " + extraClasses}
    >
      {childSubjects?.length ? (
        <a
          className={cn("toggle", { expanded })}
          onClick={() => setExpanded(val => !val)}
          style={{ color: item.textColor || "white", borderRight: `var(--default-border-width) solid ${item.textColor || "white"}` }}
        >
          <i className="fad fa-chevron-right"></i>
        </a>
      ) : null}

      <span>{props.name}</span>

      {props.children || item.name}
      <a onClick={onEdit} style={{ color: item.textColor || "white", cursor: "pointer", marginLeft: "5px" }}>
        <i className="fal fa-pencil-alt"></i>
      </a>
    </span>
  );
};

export const RemovableLabelDisplay = props => {
  let item = props.item || {};
  let extraStyles = props.style || {};
  let extraClasses = props.className || "";

  return (
    <span
      style={{ backgroundColor: item.backgroundColor, color: item.textColor || "white", ...extraStyles }}
      className={"label label-default noselect " + extraClasses}
    >
      <button className="raw-button cursor-pointer fw-700" onClick={props.doRemove} style={{ color: item.textColor || "white" }}>
        X
      </button>
      <span style={{ marginLeft: 5, paddingLeft: 5, borderLeft: "var(--default-border-width) solid white" }}>{props.name}</span>
      {props.children || item.name}
    </span>
  );
};
