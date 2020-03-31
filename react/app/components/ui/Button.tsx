import React, { useState, useRef, useLayoutEffect, FC, Children, useEffect } from "react";

import cn from "classnames";

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

export const Button = props => {
  const { style, className, disabled, onClick, preset, css, children, ...rest } = props;
  return (
    <button className={cssFromPreset(props)} style={style} onClick={onClick} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

type ActionButtonType = {
  className?: any;
  style?: any;
  baseWidth?: any;
  onClick: any;
  text: any;
  type?: any;
  disabled?: boolean;
  preset?: string;
  runningText?: string;
  finishedText?: string;
  icon?: string;
};

export const ActionButton: FC<ActionButtonType> = props => {
  const active = useRef(true);
  const { style: originalStyle = {}, className = "", onClick: clickFn, text, disabled, icon, baseWidth, finishedText, ...rest } = props;
  const [isRunning, setRunning] = useState(false);
  const [isFinished, setFinished] = useState(false);

  useEffect(() => {
    return () => {
      active.current = false;
    };
  }, []);

  const style = {
    minWidth: baseWidth || `${text.length + 2}ch`,
    ...originalStyle
  };

  const iconStyles = {
    marginLeft: text.length ? "3px" : void 0
  };
  const finishedIconStyles = {
    marginLeft: text.length ? "5px" : void 0
  };

  const runningText = props.hasOwnProperty("runningText") ? props.runningText : props.text;

  const onClick = (...args) => {
    let result = clickFn(...args);

    if (!result.then) {
      return;
    }

    setRunning(true);
    Promise.resolve(result).then(() => {
      if (!active.current) {
        return;
      }
      if (finishedText) {
        setFinished(true);
        setTimeout(() => {
          if (active.current) {
            setFinished(false);
            setRunning(false);
          }
        }, 2000);
      } else {
        setRunning(false);
      }
    });
  };

  return (
    <button
      onClick={onClick}
      style={style}
      disabled={isRunning || isFinished || disabled || false}
      className={cn(cssFromPreset(props), className, "bl-action-button")}
      {...rest}
    >
      {isFinished ? finishedText : isRunning ? runningText || text : text}
      {isFinished ? (
        <i style={finishedIconStyles} className="fal fa-check" />
      ) : isRunning ? (
        <i style={iconStyles} className="fa fa-fw fa-spin fa-spinner" />
      ) : icon ? (
        <i style={iconStyles} className={icon} />
      ) : null}
    </button>
  );
};
