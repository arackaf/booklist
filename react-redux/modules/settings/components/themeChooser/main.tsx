import React, { Component, useContext } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import { AppContext } from "applicationRoot/renderUI";
import { SET_THEME } from "applicationRoot/appState";
const { themeChooser } = styles;

const numThemes = 17;

const themeNames = Array.from({ length: numThemes }, (v, i) => `scheme${i + 1}`);
const arrayOfTen = Array.from({ length: 10 }, (v, i) => i + 1);

const ThemeChooser = props => {
  const [{ colorTheme }, actions, dispatch] = useContext(AppContext);
  return (
    <div>
      {themeNames.map((name, index) => (
        <>
          <div onClick={() => dispatch({ type: SET_THEME, theme: name })} className={classNames(name, themeChooser, { active: colorTheme == name })}>
            <span>
              {"Theme " + (index + 1)}
              {colorTheme == name ? <i className="far fa-check margin-left" /> : null}
            </span>
            {arrayOfTen.map(val => (
              <div style={{ backgroundColor: `var(--primary-${val})` }} />
            ))}
          </div>
          <br />
        </>
      ))}
    </div>
  );
};

export default ThemeChooser;
