import React, { useState, useRef, useLayoutEffect } from "react";

const cssPresets = {};
const buttonTypes = ["default", "primary", "success", "info", "warning", "danger"];
const buttonSizes = ["lg", "sm", "xs"];

buttonTypes.forEach(t => {
  cssPresets[t] = `btn-${t}`; //default size
  buttonSizes.forEach(s => {
    cssPresets[`${t}-${s}`] = `btn-${t} btn-${s}`;
  });
});

const cssFromPreset = props => (props.className || "") + " btn " + (cssPresets[props.preset] || props.css || "");

export default props => (
  <button className={cssFromPreset(props)} style={{ ...props.style }} onClick={props.onClick} disabled={props.disabled}>
    {props.children}
  </button>
);

export const BootstrapAnchorButton = props => (
  <a className={cssFromPreset(props)} style={{ ...props.style }} onClick={props.onClick}>
    {props.children}
  </a>
);

export const AjaxButton = props => {
  const controlled = props.hasOwnProperty("running");
  const [isRunning, setRunning] = useState(controlled ? props.running : false);

  if (!controlled) {
    return <AjaxButtonUnControlled {...props} />;
  }

  const onClick = (...args) => {
    if (controlled) {
      props.onClick(...args);
    } else {
      setRunning(true);
      Promise.resolve(props.onClick(...args)).then(() => setRunning(false));
    }
  };

  let isRunningAdjusted = controlled ? props.running : isRunning;

  return isRunningAdjusted ? (
    <button className={cssFromPreset(props)} disabled={true}>
      <i className="fa fa-fw fa-spin fa-spinner" />
      {props.runningText || props.text ? " " + props.runningText || props.text : props.children}
    </button>
  ) : (
    <button className={cssFromPreset(props)} disabled={props.disabled || false} onClick={onClick}>
      {props.children}
    </button>
  );
};

const AjaxButtonUnControlled = props => {
  const [isRunning, setRunning] = useState(false);
  const [isFinished, setFinished] = useState(false);
  const mounted = useRef(true);

  useLayoutEffect(() => () => (mounted.current = false), []);

  const onClick = (...args) => {
    setRunning(true);
    Promise.resolve(props.onClick(...args)).then(() => {
      setFinished(true);
      setRunning(false);
      setTimeout(() => mounted.current && setFinished(false), 2000);
    });
  };

  const { onClick: unused, className, runningText, finishedText, children, ...allRemainingProps } = props;
  const { disabled, ...allNonDisabledProps } = allRemainingProps;

  return isRunning ? (
    <button className={cssFromPreset(props)} disabled={true} {...allNonDisabledProps}>
      {runningText || props.children}
      <i className="fa fa-fw fa-spin fa-spinner" style={{ marginLeft: "3px" }} />
    </button>
  ) : isFinished ? (
    <button className={cssFromPreset(props)} onClick={onClick} disabled={true} {...allNonDisabledProps}>
      {finishedText || props.children}
      <i className="fa fa-fw fa-check" style={{ marginLeft: "3px" }} />
    </button>
  ) : (
    <button className={cssFromPreset(props)} onClick={onClick} {...allRemainingProps}>
      {props.children}
    </button>
  );
};

export const AjaxButtonAnchor = props =>
  props.running ? (
    <a className={cssFromPreset(props)}>
      <i className="fa fa-fw fa-spin fa-spinner" />
      {props.runningText || props.text ? " " + props.runningText || props.text : props.children}
    </a>
  ) : (
    <a className={cssFromPreset(props)} onClick={props.onClick}>
      {props.children}
    </a>
  );
